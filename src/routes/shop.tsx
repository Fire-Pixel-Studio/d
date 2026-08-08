import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

type ShopSearch = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Imported Pieces — Diablo" },
      {
        name: "description",
        content:
          "Browse every Diablo piece: tees, baggy jeans, jackets, shirts, cargos and accessories. Filter by category and sort by price.",
      },
      { property: "og:title", content: "Shop All Imported Pieces — Diablo" },
      {
        property: "og:description",
        content: "Browse every Diablo piece. Single stock, honest condition notes.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery);
  },
  component: Shop,
});

const SORTS = [
  { id: "latest", label: "Latest" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
] as const;

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { category } = Route.useSearch();
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("latest");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const visible = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl">Shop</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Showing {visible.length} of {products.length} pieces
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="label-caps text-gold">Search</p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value.slice(0, 60))}
              placeholder="Brand or name"
              className="mt-3 w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <p className="label-caps text-gold">Category</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <Link
                  to="/shop"
                  search={{}}
                  className={
                    category
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-gold"
                  }
                >
                  All
                </Link>
              </li>
              {categories.map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    search={{ category: item }}
                    className={
                      category === item
                        ? "text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-gold">Sort</p>
            <ul className="mt-3 space-y-1 text-sm">
              {SORTS.map((option) => (
                <li key={option.id}>
                  <button
                    onClick={() => setSort(option.id)}
                    className={
                      sort === option.id
                        ? "text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing matches that. Try another category.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
