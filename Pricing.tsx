import type { PlanInfo } from "./StripeCheckout";

interface Plan {
  name: string;
  price: string;
  priceValue: number;
  period: string;
  quota: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  free?: boolean;
}

interface Props {
  onSelect: (plan: PlanInfo) => void;
  stripeConnected: boolean;
  isTestMode?: boolean;
  businessName?: string;
  /** Names of plans where the button redirects to a real Stripe link */
  livePlans?: string[];
}

const plans: Plan[] = [
  {
    name: "Découverte",
    price: "0 €",
    priceValue: 0,
    period: "à vie",
    quota: "1 photo offerte",
    features: [
      "Analyse complète unique",
      "Morphotype + body fat",
      "Plan exercices basique",
      "Pas de carte requise",
    ],
    cta: "Commencer gratuitement",
    badge: "Gratuit",
    free: true,
  },
  {
    name: "Starter",
    price: "9,99 €",
    priceValue: 9.99,
    period: "/ mois",
    quota: "10 photos / mois",
    features: [
      "Toutes les analyses détaillées",
      "Compléments personnalisés",
      "Plan nutrition complet",
      "Historique des analyses",
    ],
    cta: "Choisir Starter",
  },
  {
    name: "Pro",
    price: "29,99 €",
    priceValue: 29.99,
    period: "/ mois",
    quota: "35 photos / mois",
    features: [
      "Tout ce qui est dans Starter",
      "Suivi de progression mensuel",
      "Recommandations IA avancées",
      "Export PDF de tes plans",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlighted: true,
    badge: "Le plus populaire",
  },
  {
    name: "Unlimited",
    price: "79,99 €",
    priceValue: 79.99,
    period: "/ mois",
    quota: "Analyses illimitées",
    features: [
      "Tout ce qui est dans Pro",
      "Analyses illimitées",
      "Accès anticipé aux nouveautés",
      "Coach IA disponible 24/7",
      "API personnelle",
    ],
    cta: "Choisir Unlimited",
  },
];

export default function Pricing({ onSelect, stripeConnected, isTestMode, businessName, livePlans = [] }: Props) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center reveal">
        <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
          Tarifs
        </span>
        <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          Choisis ton <span className="text-amber-400">plan</span>
        </h2>
        <p className="mt-3 text-zinc-400">
          Commence gratuitement, passe à un plan payant quand tu veux. Annulable en 1 clic.
        </p>
        <div
          className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 ${
            isTestMode
              ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
              : stripeConnected
                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                : "bg-white/[0.02] text-zinc-400 ring-white/10"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isTestMode ? "animate-pulse bg-amber-400" : stripeConnected ? "animate-pulse bg-emerald-400" : "bg-zinc-500"}`} />
          {isTestMode ? (
            <>
              ⚠️ Stripe en mode TEST · {businessName ?? "Bodyscan.io (test)"} — les cartes ne sont pas réellement débitées
            </>
          ) : stripeConnected ? (
            <>
              Paiements Stripe actifs
              {businessName && <span className="text-emerald-400/80">· {businessName}</span>}
            </>
          ) : (
            <>
              Mode démo · <span className="text-zinc-300">connecte ton Stripe pour encaisser réellement</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`reveal hover-lift relative flex flex-col rounded-3xl border p-6 transition ${
              p.highlighted
                ? "animate-glow scale-[1.02] border-amber-500/60 bg-gradient-to-b from-amber-500/[0.12] to-zinc-950 shadow-2xl shadow-amber-900/30"
                : "border-white/10 bg-zinc-950/60 hover:border-amber-500/20"
            }`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {p.badge && (
              <span
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold ${
                  p.highlighted
                    ? "animate-shimmer bg-amber-500 text-zinc-900"
                    : "bg-white/10 text-zinc-300 ring-1 ring-white/10"
                }`}
              >
                {p.badge}
              </span>
            )}

            <h3 className="text-lg font-semibold text-white">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{p.price}</span>
              <span className="text-sm text-zinc-500">{p.period}</span>
            </div>
            <div className="mt-1 text-sm font-medium text-amber-400">{p.quota}</div>

            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-zinc-300">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (p.free) {
                  document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" });
                  return;
                }
                onSelect({
                  name: p.name,
                  price: p.price,
                  priceValue: p.priceValue,
                  period: p.period,
                  quota: p.quota,
                });
              }}
              className={`mt-6 rounded-xl py-3 text-sm font-semibold transition ${
                p.highlighted
                  ? "bg-amber-500 text-zinc-900 hover:bg-amber-400"
                  : p.free
                    ? "border border-white/15 text-white hover:bg-white/5"
                    : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {p.cta}
            </button>

            {p.priceValue > 0 && (
              <div
                className={`mt-3 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider ${
                  livePlans.includes(p.name)
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              >
                {livePlans.includes(p.name) ? (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Checkout Stripe en direct</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Démo · Clic pour essayer</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
