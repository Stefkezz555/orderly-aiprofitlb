import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dizajn sistem · Orderly",
};

const colors = [
  { name: "brand-accent", hex: "#1B6EF3", swatch: "bg-brand-accent", bg: "bg-brand-accent-bg" },
  { name: "success", hex: "#16A34A", swatch: "bg-success", bg: "bg-success-bg" },
  { name: "warning", hex: "#D97706", swatch: "bg-warning", bg: "bg-warning-bg" },
  { name: "danger", hex: "#DC2626", swatch: "bg-danger", bg: "bg-danger-bg" },
  { name: "neutral", hex: "#6366F1", swatch: "bg-neutral", bg: "bg-neutral-bg" },
];

const shadows = [
  { name: "shadow-sm", use: "Kartica", className: "shadow-sm" },
  { name: "shadow-md", use: "Prelaz mišem", className: "shadow-md" },
  { name: "shadow-lg", use: "Prozori", className: "shadow-lg" },
];

const statuses = [
  { label: "Završeno", className: "bg-success-bg text-success" },
  { label: "Na čekanju", className: "bg-warning-bg text-warning" },
  { label: "Otkazano", className: "bg-danger-bg text-danger" },
  { label: "Nova", className: "bg-neutral-bg text-neutral" },
];

function Showcase() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Tipografija</p>
        <p className="text-kpi">€12.480</p>
        <h1 className="text-h1">Naslov stranice (H1)</h1>
        <p className="text-card-title">Naslov kartice</p>
        <p className="text-body text-muted-foreground">
          Običan tekst, 13px. Porudžbine sa svih prodavnica na jednom mestu.
        </p>
        <p className="text-label text-muted-foreground">Oznaka velikim slovima</p>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Boje</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {colors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className={`h-14 ${c.swatch}`} />
              <div className={`h-6 ${c.bg}`} />
              <div className="p-2">
                <p className="text-card-title">{c.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Senke</p>
        <div className="grid gap-4 sm:grid-cols-4">
          {shadows.map((s) => (
            <div key={s.name} className={`rounded-lg border bg-card p-4 ${s.className}`}>
              <p className="text-card-title">{s.name}</p>
              <p className="text-body text-muted-foreground">{s.use}</p>
            </div>
          ))}
          <div className="card-hover rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-card-title">card-hover</p>
            <p className="text-body text-muted-foreground">Pređi mišem</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Dugmad i oznake</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="press rounded-md bg-brand-accent px-4 py-2 text-card-title text-white hover:bg-brand-accent-hover"
          >
            Sinhronizuj
          </button>
          <button
            type="button"
            className="press rounded-md bg-brand-accent-bg px-4 py-2 text-card-title text-brand-accent"
          >
            Sekundarno
          </button>
          {statuses.map((s) => (
            <span
              key={s.label}
              className={`rounded-full px-2.5 py-0.5 text-label ${s.className}`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted-foreground">Animacija nove porudžbine</p>
        <div className="animate-order-in rounded-lg border p-3">
          <p className="text-card-title">Nova porudžbina · €49,00</p>
        </div>
      </section>
    </div>
  );
}

export default function TestPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-6 py-10">
      <div>
        <h1 className="text-h1">Dizajn sistem</h1>
        <p className="text-body text-muted-foreground">
          Probna stranica za brend tokene (korak 0.3).
        </p>
      </div>

      <Showcase />

      <div className="dark rounded-xl bg-background p-6 text-foreground">
        <p className="text-label mb-6 text-muted-foreground">Tamna tema (.dark)</p>
        <Showcase />
      </div>
    </main>
  );
}
