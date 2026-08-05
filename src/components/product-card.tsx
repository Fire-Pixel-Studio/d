import { Link } from "@tanstack/react-router";
import { taka } from "@/lib/format";
import type { Product } from "@/lib/products.functions";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden border border-border/70 bg-card"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1080}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!product.in_stock && (
            <span className="label-caps absolute left-0 top-4 bg-background/90 px-3 py-1.5 text-muted-foreground">
              Out of stock
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <p className="label-caps text-gold">{product.category}</p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block text-sm font-medium leading-snug transition-colors hover:text-gold"
        >
          {product.name}
        </Link>
        <p className="font-display text-xl">{taka(product.price)}</p>
      </div>
    </article>
  );
}
