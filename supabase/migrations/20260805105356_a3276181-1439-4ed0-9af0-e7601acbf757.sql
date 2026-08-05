CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'OTHER',
  price numeric(10,2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  condition_note text NOT NULL DEFAULT '',
  sizes text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL DEFAULT '',
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders ON DELETE CASCADE,
  product_id uuid REFERENCES public.products ON DELETE SET NULL,
  product_name text NOT NULL,
  size text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.products (slug, name, brand, category, price, description, condition_note, sizes, image_url, in_stock, featured) VALUES
('chrome-hearts-official-tee','CHROME HEARTS OFFICIAL TEE','CHROME HEARTS','T-SHIRTS',1250,'Heavyweight cotton tee with cross print at the back. Imported single piece.','Tiny faint stain near hem, size of a pencil eraser. May come out with a gentle wash.','{"M","L"}','/products/tee-cross.jpg',true,true),
('ami-paris-official-tee','AMI PARIS OFFICIAL TEE','AMI','T-SHIRTS',1150,'Soft-touch cotton tee with embroidered heart logo on chest.','Excellent condition, no visible flaws.','{"S","M","L"}','/products/tee-ami.jpg',true,true),
('adidas-official-tee','ADIDAS OFFICIAL TEE','ADIDAS','T-SHIRTS',850,'Classic three-stripe training tee, breathable cotton blend.','Light fading on the collar.','{"M","L","XL"}','/products/tee-adidas.jpg',false,false),
('bershka-circle-cut-baggy-jeans','BERSHKA CIRCLE CUT BAGGY JEANS','BERSHKA','BAGGY JEANS',1699,'Wide-leg baggy denim with a clean circle cut and deep pockets.','Minor wear at the hem, adds to the character.','{"30","32","34"}','/products/jeans-baggy.jpg',true,true),
('vintage-washed-carpenter-jeans','VINTAGE WASHED CARPENTER JEANS','LEVI''S','BAGGY JEANS',1899,'Stone-washed carpenter denim with hammer loop and utility pocket.','Authentic vintage fading throughout.','{"32","34","36"}','/products/jeans-carpenter.jpg',true,false),
('nike-quarter-zip-fleece','NIKE QUARTER ZIP FLEECE','NIKE','SWEATSHIRTS',1650,'Brushed-back fleece quarter zip with embroidered swoosh.','Very good condition, slight pilling under arms.','{"M","L"}','/products/fleece-zip.jpg',true,true),
('vintage-varsity-bomber-jacket','VINTAGE VARSITY BOMBER JACKET','VINTAGE','JACKETS',3200,'Wool body varsity with leather sleeves and ribbed trims.','Small scuff on the left cuff.','{"L","XL"}','/products/jacket-varsity.jpg',true,true),
('carhartt-detroit-work-jacket','CARHARTT DETROIT WORK JACKET','CARHARTT','JACKETS',4200,'Rugged duck canvas work jacket with corduroy collar and blanket lining.','Broken-in workwear patina, fully functional zip.','{"M","L"}','/products/jacket-carhartt.jpg',true,false),
('artificial-leather-emboss-wallet','ARTIFICIAL LEATHER EMBOSS WALLET','—','WALLET',650,'Hard emboss geometric pattern bifold wallet with card slots.','Brand new, unused.','{"OS"}','/products/wallet-emboss.jpg',true,false),
('polo-check-flannel-shirt','POLO CHECK FLANNEL SHIRT','POLO','SHIRTS',1350,'Brushed cotton flannel in a muted check, boxy fit.','One spare button missing, all others intact.','{"M","L","XL"}','/products/shirt-flannel.jpg',true,false),
('cargo-parachute-pants','CARGO PARACHUTE PANTS','—','CARGO',1750,'Nylon parachute cargos with adjustable toggles at the ankle.','Excellent condition.','{"30","32","34"}','/products/pants-cargo.jpg',true,false),
('leather-strap-field-watch','LEATHER STRAP FIELD WATCH','—','ACCESSORIES',2100,'Minimal field watch with brushed steel case and leather strap.','Fresh battery installed, light strap wear.','{"OS"}','/products/watch-field.jpg',true,false);
