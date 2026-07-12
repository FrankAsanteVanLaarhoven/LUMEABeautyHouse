import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "LUMÉA Beauty House — inclusive luxury makeup, skin, and hair. Light for every face, every undertone, every texture.",
};

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-line bg-ink px-5 py-20 text-ivory md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            About the house
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-tight md:text-6xl lg:text-7xl">
            Beauty without boundaries.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ivory/75 md:text-lg">
            LUMÉA is a modern beauty house built for the full spectrum of human
            skin and hair. We design shade systems, clinical care, and digital
            experiences that treat every undertone — deep brown, olive, warm,
            cool, fair, and everything between — as first-class.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl">Our story</h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft md:text-base">
          <p>
            Too many beauty shelves still treat inclusive shade ranges as an
            afterthought — ash foundations, missing undertones, hair rituals
            written only for one texture. LUMÉA was founded to reverse that:
            start with the full range of faces and hair patterns, then build
            formulas, packaging, and digital tools that honour them.
          </p>
          <p>
            From Veil Soft-Focus Foundation across fifty undertones to Coil
            Define rituals for 4C patterns, every product is engineered for
            wear, light, and real life. Our Mirror Studio lets you trial colour
            before you commit. Our tutorials centre women of colour, Asian,
            Hispanic, and every community that shops beauty with intention.
          </p>
          <p>
            Beyond the house brand, LUMÉA Commerce OS offers multi-tenant
            storefronts, white-label try-on studios, team seats, and brand
            tooling — so independent beauty houses can sell with the same
            precision and care.
          </p>
        </div>

        <h2 className="mt-16 font-display text-3xl md:text-4xl">What we stand for</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "Inclusive by design",
              b: "Fifty foundation undertones. Hair rituals for coils, waves, and straight textures. No ash. No afterthoughts.",
            },
            {
              t: "Clinical calm",
              b: "Actives that earn their place — niacinamide, barrier care, bond-minded hair repair — without clinical coldness.",
            },
            {
              t: "Try before you buy",
              b: "Mirror Studio, shade match quiz, and reviews tagged by real skin and hair — fewer returns, more confidence.",
            },
            {
              t: "Quiet luxury",
              b: "Ivory, champagne, and craft over noise. Motion with purpose. Packaging that feels like sculpture.",
            },
          ].map((item) => (
            <li
              key={item.t}
              className="border border-line bg-surface p-5"
            >
              <h3 className="font-medium">{item.t}</h3>
              <p className="mt-2 text-sm text-muted">{item.b}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 font-display text-3xl md:text-4xl">Payments & care</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
          Secure checkout is available via card (Stripe when configured),{" "}
          <strong className="text-ink">PayPal</strong>, and LUMÉA Wallet.
          PayPal payments are processed to the house merchant account. Free
          standard shipping from $75. Thirty-day returns on unopened product.
          Questions: reach us through your account or the footer contact path.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Shop the collection
          </Link>
          <Link href="/studio" className="btn-ghost">
            Open Mirror Studio
          </Link>
          <Link href="/platform" className="btn-ghost">
            For brands
          </Link>
        </div>
      </section>
    </div>
  );
}
