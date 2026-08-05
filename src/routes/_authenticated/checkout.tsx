import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { placeOrder } from "@/lib/orders.functions";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Diableo" },
      { name: "description", content: "Confirm your delivery details and place your Diableo order." },
      { property: "og:title", content: "Checkout — Diableo" },
      { property: "og:description", content: "Confirm your delivery details for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      submitOrder({
        data: {
          ...form,
          items: items.map((item) => ({
            slug: item.slug,
            size: item.size,
            quantity: item.quantity,
          })),
        },
      }),
    onSuccess: () => {
      clear();
      toast.success("Order placed. We will confirm on WhatsApp shortly.");
      navigate({ to: "/orders" });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not place the order");
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl">Nothing to check out</h1>
        <Link
          to="/shop"
          className="label-caps mt-6 inline-flex bg-gold px-8 py-3 text-gold-foreground"
        >
          Shop now
        </Link>
      </div>
    );
  }

  function field(key: keyof typeof form, label: string, max: number, optional = false) {
    return (
      <div>
        <label className="label-caps text-muted-foreground" htmlFor={key}>
          {label}
        </label>
        <input
          id={key}
          value={form[key]}
          required={!optional}
          onChange={(event) => setForm({ ...form, [key]: event.target.value.slice(0, max) })}
          className="mt-2 w-full border border-input bg-card px-3 py-3 text-sm outline-none focus:border-gold"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          {field("customer_name", "Full name", 100)}
          {field("phone", "Phone number", 20)}
          {field("address", "Full address", 300)}
          {field("city", "City", 80)}
          {field("note", "Order note (optional)", 500, true)}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="label-caps w-full bg-gold py-4 text-gold-foreground disabled:opacity-50"
          >
            {mutation.isPending ? "Placing order..." : `Place order · ${taka(subtotal)}`}
          </button>
          <p className="text-xs text-muted-foreground">
            Cash on delivery. We confirm every order before dispatch.
          </p>
        </form>

        <aside className="h-fit border border-border bg-card p-6">
          <p className="label-caps text-gold">Your bag</p>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={`${item.slug}-${item.size}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {item.name} <span className="text-xs">· {item.size} × {item.quantity}</span>
                </span>
                <span>{taka(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="label-caps text-muted-foreground">Total</span>
            <span className="font-display text-2xl">{taka(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
