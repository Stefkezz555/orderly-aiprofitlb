import Link from "next/link";

const kpis = [
  { label: "Prihod danas", value: "€1.284", change: "+12,4%", up: true },
  { label: "Porudžbine", value: "38", change: "+5", up: true },
  { label: "Prosečna porudžbina", value: "€33,79", change: "-2,1%", up: false },
];

const statuses = [
  { label: "Završeno", className: "bg-success-bg text-success" },
  { label: "Na čekanju", className: "bg-warning-bg text-warning" },
  { label: "Otkazano", className: "bg-danger-bg text-danger" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <span className="inline-block rounded-full bg-brand-accent-bg px-3 py-1 text-label text-brand-accent">
            Test faza
          </span>
          <h1 className="text-kpi">
            <span className="text-brand-accent">Orderly</span>
          </h1>
          <p className="text-body text-muted-foreground">
            Osnova za dashboard porudžbina je spremna. Prave brojke stižu u Fazi 1.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.label} className="card-hover rounded-lg border bg-card p-4 shadow-sm">
              <p className="text-label text-muted-foreground">{k.label}</p>
              <p className="mt-2 text-h1">{k.value}</p>
              <p className={`mt-1 text-card-title ${k.up ? "text-success" : "text-danger"}`}>
                {k.change}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {statuses.map((s) => (
            <span key={s.label} className={`rounded-full px-2.5 py-0.5 text-label ${s.className}`}>
              {s.label}
            </span>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/test"
            className="press rounded-md bg-brand-accent px-4 py-2 text-card-title text-white shadow-sm hover:bg-brand-accent-hover"
          >
            Pogledaj dizajn sistem
          </Link>
        </div>

        <p className="text-center text-label text-muted-foreground">
          Primer podataka, nisu stvarne porudžbine
        </p>
      </div>
    </main>
  );
}
