import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, listProducts } from "@/lib/products.functions";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/format";
import { ProductCard } from "@/components/product-card";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
  });

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    context.queryClient.ensureQueryData(productsQuery);
    return { name: product.name, description: product.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Diableo" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Diableo`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery);
  const { add } = useCart();
  const [size, setSize] = useState<string>("");

  if (!product) return null;

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  function addToBag() {
    if (product!.sizes.length > 1 && !size) {
      toast.error("Pick a size first");
      return;
    }
    add({
      slug: product!.slug,
      name: product!.name,
      price: product!.price,
      image_url: product!.image_url,
      size: size || product!.sizes[0] || "OS",
    });
    toast.success("Added to your bag");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="label-caps text-muted-foreground">
        <Link to="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gold">{product.category}</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="border border-border bg-card">
          <img
            src={product.image_url}
            alt={product.name}
            width={900}
            height={1080}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div>
          <p className="label-caps text-gold">{product.brand}</p>
          <h1 className="mt-2 text-4xl leading-tight">{product.name}</h1>
          <p className="mt-4 font-display text-4xl">{taka(product.price)}</p>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 border-l-2 border-gold bg-card px-4 py-3">
            <p className="label-caps text-gold">Condition note</p>
            <p className="mt-1 text-sm text-muted-foreground">{product.condition_note}</p>
          </div>

          {product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="label-caps text-muted-foreground">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSize(option)}
                    className={`min-w-14 border px-4 py-2 text-sm transition-colors ${
                      size === option
                        ? "border-gold text-gold"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={addToBag}
              disabled={!product.in_stock}
              className="label-caps bg-gold px-9 py-4 text-gold-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.in_stock ? "Add to bag" : "Out of stock"}
            </button>
            <Link to="/cart" className="label-caps border border-border px-9 py-4">
              View bag
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="border-b border-border pb-4 text-2xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
