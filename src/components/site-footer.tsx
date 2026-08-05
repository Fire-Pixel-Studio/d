import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.14em]">DIABLEO</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Imported fashion, one piece at a time. Every item is checked by hand and photographed
            as it is.
          </p>
        </div>

        <div>
          <p className="label-caps text-gold">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-foreground">
                Your bag
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-foreground">
                Order history
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-caps text-gold">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Login / Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-caps text-gold">Reach us</p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="mailto:hello@diableo.store"
              className="flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Cash on delivery across Bangladesh.</p>
        </div>
      </div>

      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Diableo. All rights reserved.
      </div>
    </footer>
  );
}
