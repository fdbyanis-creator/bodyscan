import { useEffect, useRef, useState } from "react";
import UploadZone from "./components/UploadZone";
import AnalysisResult from "./components/AnalysisResult";
import Pricing from "./components/Pricing";
import StripeCheckout from "./components/StripeCheckout";
import type { PlanInfo } from "./components/StripeCheckout";
import StripeConnect, { loadStripeConfig, type StripeConfig } from "./components/StripeConnect";
import Testimonials from "./components/Testimonials";
import AuthGate, { loadUser, type User } from "./components/AuthGate";
import LegalModal, { type LegalPage } from "./components/LegalModal";
import { useScrollReveal } from "./hooks/useAnimations";
import { analyzeFromFile, type Analysis } from "./lib/analyze";

type Status = "idle" | "loading" | "done";

const loadingSteps = [
  "Détection des points anatomiques…",
  "Estimation du taux de masse grasse…",
  "Analyse de la symétrie & posture…",
  "Génération de ton plan personnalisé…",
];

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>(() => loadStripeConfig());
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useScrollReveal();

  function getStripeLinkFor(planName: string): string | null {
    if (planName === "Starter") return stripeConfig.starterLink || null;
    if (planName === "Pro") return stripeConfig.proLink || null;
    if (planName === "Unlimited") return stripeConfig.unlimitedLink || null;
    return null;
  }

  function handleSelectPlan(plan: PlanInfo) {
    const link = getStripeLinkFor(plan.name);
    if (link) {
      // Real Stripe — redirect to hosted checkout
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    // Fallback demo modal
    setSelectedPlan(plan);
  }

  useEffect(() => {
    if (status !== "loading") return;
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, 550);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === "done" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  async function handleFile(file: File) {
    if (!user) return; // gate
    setImageUrl(URL.createObjectURL(file));
    setStatus("loading");
    const result = await analyzeFromFile(file);
    setAnalysis(result);
    setStatus("done");
  }

  function reset() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setAnalysis(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Decorative background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, rgba(245,158,11,0.18), transparent 45%), radial-gradient(circle at 90% 60%, rgba(194,65,12,0.15), transparent 50%)",
          }}
        />
        <div
          className="animate-grid absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,191,36,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="animate-float absolute left-[15%] top-[40%] h-2 w-2 rounded-full bg-amber-400/40" style={{ animationDelay: "0.5s" }} />
        <div className="animate-float absolute right-[20%] top-[25%] h-1.5 w-1.5 rounded-full bg-amber-500/50" style={{ animationDelay: "1.2s" }} />
        <div className="animate-float absolute left-[70%] top-[70%] h-2.5 w-2.5 rounded-full bg-orange-400/30" style={{ animationDelay: "2.1s" }} />
      </div>

      <div className="relative z-0">
        {/* Nav */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <a href="#" className="group flex items-center gap-2">
            <div className="animate-float flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-900/50 transition group-hover:scale-110">
              <svg className="h-5 w-5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-1.5 7h3a2 2 0 0 1 2 2v5h-1v6h-4v-6H9.5v-5a2 2 0 0 1 1-2Z"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide text-white">Bodyscan<span className="text-amber-400">.io</span></div>
            </div>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#how" className="transition hover:text-white">Comment ça marche</a>
            <a href="#scan" className="transition hover:text-white">Analyse</a>
            <a href="#pricing" className="transition hover:text-white">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStripeOpen(true)}
                  className="hidden items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition sm:inline-flex sm:gap-2 sm:px-3 border-white/10 text-zinc-300 hover:bg-white/5"
                  title="Paramètres Stripe"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  <span className="hidden sm:inline">Admin Stripe</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((s) => !s)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-medium text-white hover:bg-white/10"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-bold text-zinc-900">
                      {user.firstName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.firstName}</span>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/50">
                        <div className="border-b border-white/5 p-3">
                          <div className="text-xs text-zinc-400">Connecté en tant que</div>
                          <div className="truncate text-sm font-semibold text-white">{user.email}</div>
                          <div className="mt-1 inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-amber-300">
                            Plan {user.plan === "free" ? "Découverte" : user.plan}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            localStorage.removeItem("bodyscan_user");
                            setUser(null);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-3 py-2.5 text-left text-sm text-red-300 hover:bg-white/5"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
              <a
                href="#scan"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                  }
                }}
                className={`group relative rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  user
                    ? "bg-amber-500 text-zinc-900 shadow-lg shadow-amber-900/40 hover:scale-105 hover:bg-amber-400 hover:shadow-amber-500/60"
                    : "pointer-events-none bg-white/10 text-zinc-500"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {user ? "Scanner gratuit" : "Commencer"}
                  {user && (
                    <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </span>
              </a>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-20 text-center">
          <span className="animate-pulse-ring inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 animate-fade-in">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Powered by Vision AI · 1 photo offerte
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl animate-fade-in">
            Envoie une photo,<br />
            reçois ton <span className="animate-gradient bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">plan complet</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Notre IA analyse ta morphologie en 3 secondes : morphotype, body fat, zones faibles,
            exercices ciblés, compléments et nutrition — tout, sans coach.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">✓ Morphotype détecté</span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">✓ Body fat estimé</span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">✓ Exercices détaillés</span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">✓ Compléments</span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">✓ Plan nutrition</span>
          </div>
        </section>

        {/* Upload / analysis */}
        <section id="scan" ref={resultRef} className="mx-auto max-w-6xl px-4 pb-20">
          {status === "idle" && (
            <UploadZone onFile={handleFile} />
          )}

          {status === "loading" && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-10 text-center">
              <div className="relative mx-auto h-64 w-48 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {imageUrl && (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-80" />
                )}
                <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_4px_rgba(251,191,36,0.6)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/0 to-amber-500/10" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">Analyse en cours…</h3>
              <div className="mx-auto mt-4 max-w-md space-y-2">
                {loadingSteps.map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      i <= step
                        ? "bg-amber-500/5 text-amber-200"
                        : "text-zinc-600"
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : i === step ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                    ) : (
                      <span className="h-3 w-3 rounded-full border border-zinc-700" />
                    )}
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "done" && analysis && imageUrl && (
            <AnalysisResult analysis={analysis} imageUrl={imageUrl} onReset={reset} />
          )}
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center reveal">
            <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
              Comment ça marche
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              3 étapes, <span className="text-amber-400">30 secondes</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Envoie ta photo",
                desc: "Une photo de face suffit. Bras le long du corps, lumière correcte.",
              },
              {
                n: "02",
                title: "L'IA scanne ton corps",
                desc: "Morphotype, composition corporelle, posture, symétrie — analysés en 3s.",
              },
              {
                n: "03",
                title: "Reçois ton plan",
                desc: "Exercices priorisés, compléments et nutrition adaptés à ta morphologie.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="reveal hover-lift rounded-2xl border border-white/10 bg-zinc-950/60 p-6 transition hover:border-amber-500/30"
                style={{ animationDelay: `${parseInt(s.n) * 150}ms` }}
              >
                <div className="font-mono text-3xl font-bold text-amber-400">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />

        <Pricing
          onSelect={handleSelectPlan}
          stripeConnected
          isTestMode={stripeConfig.starterLink.includes("/test_")}
          businessName={stripeConfig.accountName}
          livePlans={[
            stripeConfig.starterLink && "Starter",
            stripeConfig.proLink && "Pro",
            stripeConfig.unlimitedLink && "Unlimited",
          ].filter(Boolean) as string[]}
        />

        {/* Footer */}
        <footer className="border-t border-white/5 px-4 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
            <div>© 2026 Bodyscan.io — Tous droits réservés.</div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <button onClick={() => setLegalPage("legal")} className="hover:text-white">Mentions légales</button>
              <button onClick={() => setLegalPage("terms")} className="hover:text-white">CGU</button>
              <button onClick={() => setLegalPage("privacy")} className="hover:text-white">Confidentialité</button>
              <a href="mailto:support@bodyscan.io" className="hover:text-white">Contact</a>
              <button
                onClick={() => setStripeOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                {stripeConfig ? "Gérer Stripe" : "Connecter Stripe"}
              </button>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-zinc-600">
            Bodyscan.io ne remplace pas l'avis d'un médecin ou d'un nutritionniste. Les estimations
            sont indicatives et basées sur l'analyse visuelle.
          </p>
        </footer>

        <StripeCheckout plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        <StripeConnect
          open={stripeOpen}
          onClose={() => setStripeOpen(false)}
          current={stripeConfig}
          onSaved={(cfg) => setStripeConfig(cfg)}
        />
        {!user && (
          <AuthGate
            onAuth={(u) => {
              setUser(u);
            }}
          />
        )}

        <LegalModal
          open={legalPage !== null}
          initialPage={legalPage ?? "terms"}
          onClose={() => setLegalPage(null)}
        />
      </div>
    </div>
  );
}
