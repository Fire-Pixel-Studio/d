import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyOrders } from "@/lib/orders.functions";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — Diableo" },
      { name: "description", content: "Track the Diableo orders placed from your account." },
      { property: "og:title", content: "Your Orders — Diableo" },
      { property: "og:description", content: "Track the orders placed from your account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Orders,
});

function Orders() {
  const fetchOrders = useServerFn(listMyOrders);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchOrders(),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl">Your orders</h1>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading your orders...</p>}

      {!isLoading && (orders ?? []).length === 0 && (
        <div className="mt-8 border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">You haven't placed an order yet.</p>
          <Link
            to="/shop"
            className="label-caps mt-6 inline-flex bg-gold px-8 py-3 text-gold-foreground"
          >
            Shop now
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-5">
        {(orders ?? []).map((order) => (
          <article key={order.id} className="border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-caps text-gold">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
              </div>
              <span className="label-caps border border-border px-3 py-1.5 text-muted-foreground">
                {order.status}
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {(order.order_items ?? []).map((item, index) => (
                <li key={index} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {item.product_name} <span className="text-xs">· {item.size} × {item.quantity}</span>
                  </span>
                  <span>{taka(Number(item.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                {order.address}, {order.city}
              </span>
              <span className="font-display text-2xl">{taka(Number(order.total))}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
