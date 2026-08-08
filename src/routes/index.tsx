import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";
import heroImage from "@/assets/hero.jpg";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diablo — Imported Fashion, One Piece At A Time" },
      {
        name: "description",
        content:
          "Hand-picked imported tees, baggy jeans, jackets and accessories. Every piece is single stock, checked by hand and priced in taka.",
      },
      { property: "og:title", content: "Diablo — Imported Fashion, One Piece At A Time" },
      {
        property: "og:description",
        content: "Hand-picked imported streetwear and fashion pieces. Single stock, real photos.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
  },
  component: Index,
});

const CATEGORIES = ["T-SHIRTS", "BAGGY JEANS", "JACKETS", "SHIRTS", "CARGO", "ACCESSORIES"];

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const rest = products.filter((p) => !p.featured).slice(0, 4);

  return (
    <>
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={heroImage}
            alt="Two models wearing imported streetwear from Diablo"
            width={1920}
            height={1088}
            className="size-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4">
              <div className="max-w-xl">
                <p className="label-caps text-gold">New drop · single pieces</p>
                <h1 className="mt-4 text-5xl leading-[0.95] sm:text-7xl">
                  Imported fashion
                  <br />
                  worn once, kept forever
                </h1>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                  Every piece is one of one. We photograph what you get, note every flaw, and ship
                  across Bangladesh.
                </p>
                <Link
                  to="/shop"
                  className="label-caps mt-8 inline-flex bg-gold px-9 py-4 text-gold-foreground transition-opacity hover:opacity-90"
                >
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/shop"
              search={{ category }}
              className="label-caps border border-border px-5 py-3 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-3xl">Featured pieces</h2>
          <Link to="/shop" className="label-caps text-gold">
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="panel royal-gradient grid gap-6 p-10 sm:grid-cols-3">
          {[
            { title: "One of one", body: "Single stock per style. When it's gone, it's gone." },
            { title: "Honest condition", body: "Every stain or mark is written on the product." },
            { title: "Cash on delivery", body: "Pay when the parcel reaches your hand." },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-xl text-gold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-3xl">Just added</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
