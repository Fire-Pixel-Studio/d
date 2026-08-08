import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Diablo — How We Source & Ship" },
      {
        name: "description",
        content:
          "Diablo hand-picks imported fashion pieces, checks every garment, notes every flaw and ships cash on delivery across Bangladesh.",
      },
      { property: "og:title", content: "About Diablo — How We Source & Ship" },
      {
        property: "og:description",
        content: "How Diablo sources, checks and ships imported fashion pieces.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl">About us</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Diablo is built on a simple belief: good clothing shouldn't be mass produced. We source
          imported fashion pieces in small batches, inspect every garment by hand, and list each
          item as a true one-of-one — its own photo, its own story.
        </p>
        <p>
          Because every piece is unique, honesty matters. We note the real condition on every
          product page, down to the smallest detail — a faint mark, a missing button, a
          broken-in hem. If something doesn't match what's described, reach out and we'll make
          it right.
        </p>
        <h2 className="pt-4 text-2xl text-foreground">How ordering works</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Add the piece to your cart and pick a size.</li>
          <li>Create an account or log in so your order can be tracked.</li>
          <li>Fill in your delivery details at checkout.</li>
          <li>Pay cash when the parcel reaches your hand.</li>
        </ol>
        <h2 className="pt-4 text-2xl text-foreground">Get in touch</h2>
        <p>
          Questions, flaws to report, or anything else — email us at{" "}
          <a href="mailto:hello@diablostore.me" className="text-gold hover:underline">
            hello@diablostore.me
          </a>{" "}
          or message us on{" "}
          <a
            href="https://www.instagram.com/diablo.casa/"
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            Instagram
          </a>
          .
        </p>
      </div>
      <Link
        to="/shop"
        className="label-caps mt-10 inline-flex bg-primary px-8 py-4 text-primary-foreground"
      >
        Start shopping
      </Link>
    </div>
  );
}
