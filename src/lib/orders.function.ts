import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { orderInputSchema, type OrderInput } from "./orders.schema";

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: OrderInput) => orderInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const slugs = data.items.map((item) => item.slug);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, slug, name, price, in_stock")
      .in("slug", slugs);
    if (productError) throw new Error(productError.message);
    if (!products || products.length === 0) throw new Error("No valid products in cart");

    const priced = data.items.flatMap((item) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product || !product.in_stock) return [];
      return [
        {
          product_id: product.id,
          product_name: product.name,
          price: Number(product.price),
          quantity: item.quantity,
          size: item.size,
        },
      ];
    });
    if (priced.length === 0) throw new Error("Items in your bag are no longer available");

    const total = priced.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        note: data.note,
        total,
      })
      .select("id")
      .single();
    if (orderError) throw new Error(orderError.message);

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(priced.map((item) => ({ ...item, order_id: order.id })));
    if (itemsError) throw new Error(itemsError.message);

    return { id: order.id, total };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, created_at, total, status, city, address, order_items(product_name, size, price, quantity)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
