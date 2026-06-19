import { useEffect, useState } from "react";

export interface StripeConfig {
  starterLink: string;
  proLink: string;
  unlimitedLink: string;
  accountName: string;
}

const STORAGE_KEY = "bodyscan_stripe_config";

// Default pre-configured Stripe test links — override via the "Connecter Stripe" modal.
const DEFAULT_CONFIG: StripeConfig = {
  accountName: "Bodyscan.io (test)",
  starterLink: "https://buy.stripe.com/test_14A9AM73eeZCebIe68ds400",
  proLink: "https://buy.stripe.com/test_8x200c0EQ3gU1oW5zCds401",
  unlimitedLink: "https://buy.stripe.com/test_14A7sEcny9Fi0kSgegds402",
};

export function loadStripeConfig(): StripeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StripeConfig;
      // Merge with defaults so pre-filled Starter always works
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONFIG };
}

export function saveStripeConfig(cfg: StripeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function clearStripeConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: (cfg: StripeConfig) => void;
  current: StripeConfig;
}

const planKeys: { key: keyof Omit<StripeConfig, "accountName">; label: string; placeholder: string }[] = [
  {
    key: "starterLink",
    label: "Starter — 9,99 €/mois",
    placeholder: "https://buy.stripe.com/xxxxxx",
  },
  {
    key: "proLink",
    label: "Pro — 29,99 €/mois",
    placeholder: "https://buy.stripe.com/xxxxxx",
  },
  {
    key: "unlimitedLink",
    label: "Unlimited — 79,99 €/mois",
    placeholder: "https://buy.stripe.com/xxxxxx",
  },
];

export default function StripeConnect({ open, onClose, onSaved, current }: Props) {
  const [form, setForm] = useState<StripeConfig>(current);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setSaved(false);
      setForm(current);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, current]);

  if (!open) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const cleaned: StripeConfig = {
      ...DEFAULT_CONFIG,
      accountName: form.accountName.trim() || DEFAULT_CONFIG.accountName,
      starterLink: form.starterLink.trim() || DEFAULT_CONFIG.starterLink,
      proLink: form.proLink.trim(),
      unlimitedLink: form.unlimitedLink.trim(),
    };
    // Validate URLs (accept buy.stripe.com or any stripe payment link)
    for (const k of ["starterLink", "proLink", "unlimitedLink"] as const) {
      const v = cleaned[k];
      if (v && !/^https?:\/\/(buy\.stripe\.com|checkout\.stripe\.com|pay\.stripe\.com|stripe\.com)\/.+/.test(v)) {
        alert(`Le lien pour ${k} doit être une URL Stripe valide (https://buy.stripe.com/...)`);
        return;
      }
    }
    const hasAtLeastOne = cleaned.starterLink || cleaned.proLink || cleaned.unlimitedLink;
    if (!hasAtLeastOne) {
      alert("Ajoute au moins un lien de paiement Stripe.");
      return;
    }
    saveStripeConfig(cleaned);
    onSaved(cleaned);
    setSaved(true);
    setTimeout(() => onClose(), 1100);
  }

  function handleDisconnect() {
    if (confirm("Déconnecter ton compte Stripe ? Les paiements reviendront au lien Starter par défaut (test).")) {
      clearStripeConfig();
      onSaved({ ...DEFAULT_CONFIG });
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-7 md:p-9">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635bff]/15 ring-1 ring-[#635bff]/30">
              <svg viewBox="0 0 60 25" className="h-6 w-auto fill-[#635bff]">
                <path d="M59.64 14.27h-5.2c.22 1.73 1.49 2.6 3.34 2.6 1.39 0 2.5-.37 3.49-.9v3.3c-1.12.66-2.74 1.04-4.5 1.04-4.21 0-6.78-2.39-6.78-6.49 0-4.12 2.56-6.6 6.47-6.6 3.69 0 5.9 2.27 5.9 6.3 0 .5-.04.8-.22.95zm-5.2-2.4h3.17c-.05-1.45-.73-2.3-1.58-2.3-.88 0-1.49.7-1.59 2.3zm-1.23 2.83H48c.22 1.73 1.49 2.6 3.34 2.6 1.39 0 2.5-.37 3.49-.9v3.3c-1.12.66-2.74 1.04-4.5 1.04-4.21 0-6.78-2.39-6.78-6.49 0-4.12 2.56-6.6 6.47-6.6 3.69 0 5.9 2.27 5.9 6.3 0 .5-.04.8-.22.95zm-5.2-2.4h3.17c-.05-1.45-.73-2.3-1.58-2.3-.88 0-1.49.7-1.59 2.3zm-5.5 5.1c0 1.14.88 1.82 2.23 1.82 1.8 0 2.9-.7 3.84-1.67l2.5 2.2c-1.5 2.04-3.7 2.96-6.4 2.96-3.75 0-6.4-2.17-6.4-5.88 0-4.35 3.22-5.88 6.08-5.88 3.17 0 5.9 2 5.9 5.69 0 .42-.04.7-.19.95h-7.56zm.32-2.47h3.5c-.1-1.2-.79-2.1-1.75-2.1-.97 0-1.63.72-1.75 2.1zm-7.03 7.57h-4.27l3.86-16.7h4.27l-3.86 16.7zm-6.8-11.7c0-1.5-1.07-2.2-2.7-2.2-1.48 0-2.7.7-3.53 1.66l-2.54-2.2C20.9 2.4 23.6 1.4 26.4 1.4c3.86 0 6.7 2.17 6.7 5.88 0 5.07-6.7 4.2-6.7 7.2 0 1.1.97 1.8 2.6 1.8 1.4 0 2.7-.6 3.65-1.56l2.45 2.15c-1.37 1.8-3.52 2.84-6.1 2.84-3.7 0-6.7-2.1-6.7-5.77 0-5.3 6.8-4.4 6.8-7.36zM6.82 14.7c0 1.14.88 1.82 2.23 1.82 1.8 0 2.9-.7 3.84-1.67l2.5 2.2c-1.5 2.04-3.7 2.96-6.4 2.96-3.75 0-6.4-2.17-6.4-5.88 0-4.35 3.22-5.88 6.08-5.88 3.17 0 5.9 2 5.9 5.69 0 .42-.04.7-.19.95H6.82zm.32-2.4h3.5c-.1-1.2-.79-2.1-1.75-2.1-.97 0-1.63.72-1.75 2.1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Connecter Stripe</h2>
              <p className="text-sm text-zinc-400">
                Encaisser de vrais paiements avec Stripe — aucun backend requis.
              </p>
            </div>
          </div>

          {saved ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40">
                <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-emerald-300">Stripe connecté ! 🎉</h3>
              <p className="mt-1 text-sm text-emerald-200/80">
                Les boutons de paiement redirigent maintenant vers ta page Stripe hébergée.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="rounded-xl border border-[#635bff]/20 bg-[#635bff]/5 p-4 text-sm text-indigo-200">
                <div className="font-semibold text-white mb-1">🔌 Comment ça marche ?</div>
                <ol className="list-decimal space-y-1 pl-5 text-xs text-indigo-200/90">
                  <li>Connecte‑toi à ton <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer" className="underline">Dashboard Stripe</a> et crée un <b>Payment Link</b> par plan (abonnement mensuel récurrent).</li>
                  <li>Copie l'URL générée par Stripe et colle‑la ci‑dessous.</li>
                  <li>Clique sur "Enregistrer" — les clients seront redirigés vers la page Stripe hébergée, 100% sécurisée.</li>
                </ol>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Nom du compte / business (reçu de paiement)</label>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  placeholder="ex : Bodyscan.io"
                  className={inputCls}
                />
              </div>

              {planKeys.map((p) => (
                <div key={p.key}>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">{p.label}</label>
                  <input
                    type="url"
                    value={form[p.key]}
                    onChange={(e) => setForm({ ...form, [p.key]: e.target.value })}
                    placeholder={p.placeholder}
                    className={inputCls}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                {current && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/10"
                  >
                    Déconnecter Stripe
                  </button>
                )}
                <div className="flex flex-1 gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#635bff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4b44e6]"
                  >
                    Enregistrer & connecter
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:bg-black/60 focus:ring-2 focus:ring-indigo-500/20";
