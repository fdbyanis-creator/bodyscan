import { useEffect, useState } from "react";

export interface User {
  email: string;
  firstName: string;
  createdAt: number;
  plan: "free" | "starter" | "pro" | "unlimited";
}

const STORAGE_KEY = "bodyscan_user";

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(u: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
}

type Mode = "signin" | "signup" | "forgot";

interface Props {
  onAuth: (user: User) => void;
}

export default function AuthGate({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  async function handleOAuth(provider: "google" | "apple") {
    setOauthLoading(provider);
    await new Promise((r) => setTimeout(r, 1400));
    const mockEmail =
      provider === "google"
        ? `utilisateur${Math.floor(Math.random() * 9999)}@gmail.com`
        : `user${Math.floor(Math.random() * 9999)}@privaterelay.appleid.com`;
    const first = provider === "google" ? "Utilisateur" : "Apple";
    const user: User = {
      email: mockEmail,
      firstName: first,
      createdAt: Date.now(),
      plan: "free",
    };
    saveUser(user);
    setOauthLoading(null);
    onAuth(user);
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email invalide";
    if (mode === "signup") {
      if (firstName.trim().length < 2) e.firstName = "Prénom requis";
      if (password.length < 6) e.password = "6 caractères minimum";
      if (password !== password2) e.password2 = "Les mots de passe ne correspondent pas";
    }
    if (mode === "signin") {
      if (password.length < 1) e.password = "Mot de passe requis";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    if (mode === "signup" || mode === "signin") {
      const isSignup = mode === "signup";
      const first = isSignup
        ? firstName.trim()
        : email.split("@")[0].replace(/[._-]/g, " ").split(" ").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
      const user: User = {
        email: email.toLowerCase().trim(),
        firstName: first,
        createdAt: Date.now(),
        plan: "free",
      };
      saveUser(user);
      setSubmitting(false);
      onAuth(user);
    } else {
      // Mot de passe oublié
      setSubmitting(false);
      setMailSent(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
        {/* Top amber accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

        <div className="p-7 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
              <svg className="h-5 w-5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-1.5 7h3a2 2 0 0 1 2 2v5h-1v6h-4v-6H9.5v-5a2 2 0 0 1 1-2Z"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold tracking-wide text-white">
                Bodyscan<span className="text-amber-400">.io</span>
              </div>
              <div className="text-xs text-zinc-500">
                {mode === "signup" && "Crée ton compte gratuit en 30 secondes"}
                {mode === "signin" && "Connecte‑toi pour continuer"}
                {mode === "forgot" && "Réinitialise ton mot de passe"}
              </div>
            </div>
          </div>

          {!mailSent && mode !== "forgot" && (
            <div className="mb-5 grid gap-2">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:opacity-70"
              >
                {oauthLoading === "google" ? (
                  <svg className="h-4 w-4 animate-spin text-zinc-800" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.3 2.3 30 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.2 13.9 17.6 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.6-10 6.6-17.5z"/>
                    <path fill="#FBBC05" d="M10.4 28.7c-.7-2-1.1-4.2-1.1-6.7s.4-4.7 1.1-6.7l-7.8-6C0.8 13.4-.5 18.5-.5 22s1.3 8.6 4 12.7l6.9-6z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2 1.4-4.6 2.2-8.4 2.2-6.4 0-11.8-4.3-13.7-10.2l-6.9 6C6.6 42.6 14.6 48 24 48z"/>
                  </svg>
                )}
                Continuer avec Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth("apple")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-70"
              >
                {oauthLoading === "apple" ? (
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.4 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1-.1-2.6-1-2.7-3.9zm-2.5-7c.7-.8 1.1-2 1-3.1-1 0-2.1.6-2.8 1.5-.6.7-1.2 2-1 3.1 1.1.1 2.2-.6 2.8-1.5z"/>
                  </svg>
                )}
                Continuer avec Apple
              </button>
            </div>
          )}

          {!mailSent && mode !== "forgot" && (
            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-600">
              <div className="h-px flex-1 bg-white/10" />
              <span>ou avec ton email</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}

          {mailSent ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Email envoyé ! 📬</h3>
              <p className="mt-2 text-sm text-zinc-400">
                {mode === "forgot" ? (
                  <>
                    Consulte ta boîte mail <span className="font-medium text-amber-400">{email}</span> pour réinitialiser ton mot de passe.
                  </>
                ) : (
                  <>
                    Un email de bienvenue a été envoyé à <span className="font-medium text-amber-400">{email}</span> avec ton lien de validation. Tu es connecté automatiquement.
                  </>
                )}
              </p>
              {mode !== "forgot" && (
                <div className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300 ring-1 ring-amber-500/20">
                  ⏱ Redirection automatique…
                </div>
              )}
              {mode === "forgot" && (
                <button
                  onClick={() => {
                    setMailSent(false);
                    setMode("signin");
                  }}
                  className="mt-5 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-zinc-900 hover:bg-amber-400"
                >
                  Retour à la connexion
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className={inputCls}
                  />
                  {errors.firstName && <div className="mt-1 text-xs text-red-400">{errors.firstName}</div>}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className={inputCls}
                />
                {errors.email && <div className="mt-1 text-xs text-red-400">{errors.email}</div>}
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-medium text-zinc-400">Mot de passe</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrors({});
                        }}
                        className="text-xs text-amber-400 hover:underline"
                      >
                        Oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputCls + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <div className="mt-1 text-xs text-red-400">{errors.password}</div>}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Confirme le mot de passe</label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                  />
                  {errors.password2 && <div className="mt-1 text-xs text-red-400">{errors.password2}</div>}
                </div>
              )}

              {mode === "signup" && (
                <div className="flex items-start gap-2 pt-1 text-xs text-zinc-500">
                  <input type="checkbox" required defaultChecked className="mt-0.5 accent-amber-500" />
                  <span>
                    J'accepte les <a href="#" className="text-amber-400 hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-amber-400 hover:underline">politique de confidentialité</a>.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Connexion en cours…
                  </>
                ) : mode === "signup" ? (
                  "Créer mon compte"
                ) : mode === "signin" ? (
                  "Se connecter"
                ) : (
                  "Envoyer le lien"
                )}
              </button>

              <div className="mt-4 text-center text-sm text-zinc-400">
                {mode === "signup" ? (
                  <>
                    Déjà un compte ?{" "}
                    <button type="button" onClick={() => { setMode("signin"); setErrors({}); }} className="font-medium text-amber-400 hover:underline">
                      Se connecter
                    </button>
                  </>
                ) : mode === "signin" ? (
                  <>
                    Pas encore de compte ?{" "}
                    <button type="button" onClick={() => { setMode("signup"); setErrors({}); }} className="font-medium text-amber-400 hover:underline">
                      S'inscrire gratuitement
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => { setMode("signin"); setErrors({}); }} className="font-medium text-amber-400 hover:underline">
                    Retour à la connexion
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-600">
            <div className="h-px flex-1 bg-white/5" />
            <span>100% Gratuit · Sans CB</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-500">
            En continuant avec Google, Apple ou email, tu acceptes nos conditions et notre politique
            de confidentialité. Nous ne partageons jamais tes données.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber-500/60 focus:bg-black/60 focus:ring-2 focus:ring-amber-500/20";
