import { useEffect, useMemo, useState } from "react";

export interface PlanInfo {
  name: string;
  price: string;
  priceValue: number;
  period: string;
  quota: string;
}

interface Props {
  plan: PlanInfo | null;
  onClose: () => void;
}

function detectCardBrand(num: string): "visa" | "mastercard" | "amex" | "unknown" {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

function formatCardNumber(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhn(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function BrandIcon({ brand }: { brand: "visa" | "mastercard" | "amex" | "unknown" }) {
  if (brand === "visa") {
    return (
      <div className="flex h-6 w-9 items-center justify-center rounded bg-white text-[10px] font-bold italic text-blue-700">
        VISA
      </div>
    );
  }
  if (brand === "mastercard") {
    return (
      <div className="flex h-6 w-9 items-center justify-center">
        <div className="relative h-5 w-8">
          <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-red-500" />
          <div className="absolute right-0 top-0 h-5 w-5 rounded-full bg-amber-400 opacity-80" />
        </div>
      </div>
    );
  }
  if (brand === "amex") {
    return (
      <div className="flex h-6 w-9 items-center justify-center rounded bg-blue-600 text-[8px] font-bold text-white">
        AMEX
      </div>
    );
  }
  return (
    <svg className="h-6 w-9 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export default function StripeCheckout({ plan, onClose }: Props) {
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("FR");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const brand = useMemo(() => detectCardBrand(card), [card]);
  const cardClean = card.replace(/\s/g, "");

  useEffect(() => {
    if (plan) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [plan]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !processing) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, processing]);

  if (!plan) return null;

  const total = plan.priceValue;

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nom requis";
    if (!email.includes("@")) e.email = "Email invalide";
    if (!luhn(cardClean)) e.card = "Numéro de carte invalide";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = "Format MM/AA";
    else {
      const [mm, yy] = expiry.split("/").map((x) => parseInt(x, 10));
      const now = new Date();
      const expDate = new Date(2000 + yy, mm, 0);
      if (mm < 1 || mm > 12 || expDate < now) e.expiry = "Carte expirée";
    }
    if (cvc.length < 3) e.cvc = "CVC invalide";
    if (zip.length < 4) e.zip = "Code postal invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    // Simulate Stripe payment processing
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    setSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
    >
      <div className="relative my-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
        {!success ? (
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            {/* LEFT: order summary */}
            <div className="bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 p-7 md:p-8">
              <button
                onClick={onClose}
                disabled={processing}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
                  <svg className="h-4 w-4 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-1.5 7h3a2 2 0 0 1 2 2v5h-1v6h-4v-6H9.5v-5a2 2 0 0 1 1-2Z"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">Bodyscan<span className="text-amber-400">.io</span></span>
              </div>

              <h2 className="text-2xl font-bold text-white">Finaliser le paiement</h2>
              <p className="mt-1 text-sm text-zinc-400">Paiement sécurisé par Stripe</p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-400">Plan sélectionné</div>
                    <div className="mt-0.5 text-lg font-semibold text-white">{plan.name}</div>
                    <div className="text-xs text-zinc-500">{plan.quota}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{plan.price}</div>
                    <div className="text-xs text-zinc-500">{plan.period.replace("/ ", "par ")}</div>
                  </div>
                </div>

              <div className="mt-5 space-y-2 border-t border-white/5 pt-4 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Prix mensuel</span>
                  <span>{plan.priceValue.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-white">
                  <span>Total TTC</span>
                  <span>{plan.priceValue.toFixed(2)} €</span>
                </div>
                <div className="text-right text-[10px] uppercase tracking-wider text-zinc-500">
                  Prix TTC · TVA applicable selon ton pays
                </div>
              </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Annulable à tout moment en 1 clic</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Remboursement intégral sous 14 jours</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Paiement chiffré SSL · Données non stockées</span>
                </div>
              </div>
            </div>

            {/* RIGHT: payment form */}
            <div className="p-7 md:p-8">
              <h3 className="text-lg font-semibold text-white">Informations de paiement</h3>
              <p className="mt-1 text-xs text-zinc-500">
                🧪 <span className="text-amber-400">Mode démo</span> — utilisez la carte test <span className="font-mono text-amber-300">4242 4242 4242 4242</span>, n'importe quel CVC et date future.
              </p>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {/* Email */}
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="toi@exemple.com"
                    className={inputCls}
                  />
                </Field>

                {/* Card number */}
                <Field label="Numéro de carte" error={errors.card}>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card}
                      onChange={(e) => setCard(formatCardNumber(e.target.value))}
                      placeholder="1234 1234 1234 1234"
                      className={inputCls + " pr-14"}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <BrandIcon brand={brand} />
                    </div>
                  </div>
                </Field>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiration" error={errors.expiry}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="CVC" error={errors.cvc}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Name */}
                <Field label="Nom du titulaire" error={errors.name}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom Nom"
                    className={inputCls}
                  />
                </Field>

                {/* Country + zip */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Pays">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={inputCls}
                    >
                      <option value="FR">France</option>
                      <option value="BE">Belgique</option>
                      <option value="CH">Suisse</option>
                      <option value="CA">Canada</option>
                      <option value="LU">Luxembourg</option>
                    </select>
                  </Field>
                  <Field label="Code postal" error={errors.zip}>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="75001"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400 disabled:opacity-80"
                >
                  {processing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Traitement en cours…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Payer {total.toFixed(2)} €
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-zinc-500">
                  <span>Propulsé par</span>
                  <span className="font-bold text-indigo-400">stripe</span>
                  <span>·</span>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/></svg>
                  <span>Sécurisé SSL</span>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <SuccessScreen plan={plan} total={total} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-500/60 focus:bg-black/60 focus:ring-2 focus:ring-amber-500/20";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      {children}
      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
    </div>
  );
}

function SuccessScreen({ plan, total, onClose }: { plan: PlanInfo; total: number; onClose: () => void }) {
  return (
    <div className="p-8 text-center md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
        <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="mt-5 text-2xl font-bold text-white">Paiement confirmé ! 🎉</h2>
      <p className="mt-2 text-zinc-400">
        Bienvenue dans le plan <span className="font-semibold text-amber-400">{plan.name}</span>.
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-black/40 p-5 text-left text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Montant débité</span>
          <span className="font-mono text-white">{total.toFixed(2)} €</span>
        </div>
        <div className="mt-2 flex justify-between text-zinc-400">
          <span>Prochain prélèvement</span>
          <span className="text-white">Dans 30 jours</span>
        </div>
        <div className="mt-2 flex justify-between text-zinc-400">
          <span>Référence</span>
          <span className="font-mono text-xs text-zinc-300">BS-{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-500">
        Un reçu a été envoyé à ton adresse email. Tu peux annuler à tout moment depuis ton espace.
      </p>

      <button
        onClick={onClose}
        className="mt-6 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400"
      >
        Commencer à utiliser Bodyscan.io
      </button>
    </div>
  );
}
