import { Link } from "@tanstack/react-router";
import { Instagram, LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { useUser } from "@/lib/use-user";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About us" },
];

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="border-b border-border/60 bg-primary/15">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] leading-relaxed tracking-wide text-muted-foreground">
          <span className="label-caps mr-2 text-gold">Notice</span>
          Imported single pieces. Small stains are noted on every product. If a stain is large, DM
          us on Instagram and we will replace it.
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <button
          className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="mr-2 flex items-baseline gap-1">
          <span className="font-display text-3xl leading-none tracking-[0.14em]">DIABLO</span>
          <span className="size-1.5 rounded-full bg-gold" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-caps text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "label-caps text-gold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/shop"
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
            aria-label="Search the shop"
          >
            <Search className="size-5" />
          </Link>
          <a
            href="https://www.instagram.com/graudediablo/"
            target="_blank"
            rel="noreferrer"
            className="hidden text-muted-foreground transition-colors hover:text-gold sm:block"
            aria-label="Diablo on Instagram"
          >
            <Instagram className="size-5" />
          </a>
          {user ? (
            <>
              <Link
                to="/orders"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="My orders"
              >
                <User className="size-5" />
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="size-5" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="label-caps text-muted-foreground hover:text-foreground">
              Login
            </Link>
          )}
          <Link to="/cart" className="relative" aria-label="Shopping cart">
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/60 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="label-caps py-2 text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
