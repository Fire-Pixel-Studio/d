import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Diableo — How We Source & Ship" },
      {
        name: "description",
        content:
          "Diableo hand-picks imported fashion pieces, checks every garment, notes every flaw and ships cash on delivery across Bangladesh.",
      },
      { property: "og:title", content: "About Diableo — How We Source & Ship" },
      {
        property: "og:description",
        content: "How Diableo sources, checks and ships imported fashion pieces.",
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
          Diableo started with a simple idea: good clothes should not be mass produced. We import
          fashion pieces in small lots, keep only what passes our own check, and list each garment
          as a single piece with its own photo.
        </p>
        <p>
          Because everything is one of one, sizing and condition matter. We write the real condition
          on every product page — a faint stain, a missing spare button, a broken-in hem. If a flaw
          is larger than described, send us a photo on Instagram and we will replace the piece.
        </p>
        <h2 className="pt-4 text-2xl text-foreground">How ordering works</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Add the piece to your bag and pick a size.</li>
          <li>Create an account or log in so your order can be tracked.</li>
          <li>Fill in your delivery details at checkout.</li>
          <li>Pay cash when the parcel reaches your hand.</li>
        </ol>
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
