import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  condition_note: string;
  sizes: string[];
  image_url: string;
  in_stock: boolean;
  featured: boolean;
};

const COLUMNS =
  "id, slug, name, brand, category, price, description, condition_note, sizes, image_url, in_stock, featured";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(COLUMNS)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Product[];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("products")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as unknown as Product | null) ?? null;
  });
