import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Diablo" },
      {
        name: "description",
        content: "Review the imported pieces in your Diablo cart before checkout.",
      },
      { property: "og:title", content: "Your Cart — Diablo" },
      { property: "og:description", content: "Review your Diablo cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, remove, setQuantity } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="label-caps mt-6 inline-flex bg-gold px-8 py-3 text-gold-foreground"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
                <img
                  src={item.image_url}
                  alt={item.name}
                  loading="lazy"
                  width={900}
                  height={1080}
                  className="h-28 w-20 shrink-0 object-cover"
                />
                <div className="flex-1">
                  <Link
                    to="/product/$slug"
                    params={{ slug: item.slug }}
                    className="text-sm font-medium hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  <p className="label-caps mt-1 text-muted-foreground">Size {item.size}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(item.slug, item.size, item.quantity - 1)}
                      className="flex size-7 items-center justify-center border border-border text-muted-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.slug, item.size, item.quantity + 1)}
                      className="flex size-7 items-center justify-center border border-border text-muted-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3" />
                    </button>
                    <button
                      onClick={() => remove(item.slug, item.size)}
                      className="ml-2 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <p className="font-display text-xl">{taka(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-end gap-4">
            <p className="text-sm text-muted-foreground">
              Subtotal <span className="ml-3 font-display text-2xl text-foreground">{taka(subtotal)}</span>
            </p>
            <Link
              to="/checkout"
              className="label-caps bg-gold px-10 py-4 text-gold-foreground transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
