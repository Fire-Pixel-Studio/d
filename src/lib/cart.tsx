import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image_url: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (slug: string, size: string) => void;
  setQuantity: (slug: string, size: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "diableo-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore malformed cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find((i) => i.slug === item.slug && i.size === item.size);
      if (existing) {
        return current.map((i) =>
          i.slug === item.slug && i.size === item.size
            ? { ...i, quantity: Math.min(10, i.quantity + 1) }
            : i,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setItems((current) => current.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const setQuantity = useCallback((slug: string, size: string, quantity: number) => {
    setItems((current) =>
      current.map((i) =>
        i.slug === slug && i.size === size
          ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      add,
      remove,
      setQuantity,
      clear,
    }),
    [items, add, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
