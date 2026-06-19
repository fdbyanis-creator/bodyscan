import type { Analysis, Priority } from "../lib/analyze";

interface Props {
  analysis: Analysis;
  imageUrl: string;
  onReset: () => void;
}

function priorityStyle(p: Priority) {
  if (p === "Haute") return "bg-red-500/15 text-red-300 ring-1 ring-red-500/40";
  if (p === "Moyenne") return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40";
  return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40";
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-white">
          {value}
          {suffix ?? ""}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisResult({ analysis, imageUrl, onReset }: Props) {
  return (
    <div className="space-y-6">
      {/* Top: photo + summary */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60">
          <img src={imageUrl} alt="Ta photo" className="aspect-[3/4] w-full object-cover" />
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-500/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                Analyse terminée
              </span>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Tu es plutôt <span className="text-amber-400">{analysis.morphotype}</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-400">{analysis.morphoDesc}</p>
            </div>
            <button
              onClick={onReset}
              className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5"
            >
              Nouvelle analyse
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Body fat estimé</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{analysis.bodyFat}%</span>
                <span className="text-xs text-zinc-500">({analysis.bodyFatRange})</span>
              </div>
              <div className="mt-2 inline-block rounded-md bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
                {analysis.bodyFatBracket}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
              <Stat label="Masse musculaire" value={analysis.muscleMass} suffix="/100" />
              <Stat label="Posture" value={analysis.posture} suffix="/100" />
              <Stat label="Symétrie" value={analysis.symmetry} suffix="/100" />
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-300">{analysis.summary}</p>
        </div>
      </div>

      {/* Zones to work */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </span>
          <h3 className="text-xl font-bold text-white">Zones à travailler — par priorité</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {analysis.zones.map((z) => (
            <div key={z.zone} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">{z.zone}</h4>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle(z.priority)}`}>
                  Priorité {z.priority}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">{z.reason}</p>
              <ul className="mt-4 space-y-3">
                {z.exercises.map((e) => (
                  <li key={e.name} className="rounded-xl border border-white/5 bg-black/30 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium text-white">{e.name}</span>
                      <span className="shrink-0 font-mono text-xs text-amber-400">{e.sets}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                      <span>Repos : {e.rest}</span>
                      <span>· {e.tip}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements + nutrition */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 3 13l7.5-7.5a5 5 0 0 1 7 7L10.5 20.5z"/><path d="M8.5 8.5l7 7"/></svg>
            </span>
            <h3 className="text-xl font-bold text-white">Compléments recommandés</h3>
          </div>
          <ul className="space-y-3">
            {analysis.supplements.map((s) => (
              <li key={s.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="font-mono text-xs text-amber-400">{s.dose}</span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{s.why}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            ⚠️ Demande l'avis d'un professionnel de santé avant tout complément si tu prends un traitement.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            <h3 className="text-xl font-bold text-white">Plan nutrition</h3>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3">
              <div className="text-lg font-bold text-amber-300">{analysis.nutrition.calories}</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">kcal</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="text-lg font-bold text-white">{analysis.nutrition.protein}g</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">protéines</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="text-lg font-bold text-white">{analysis.nutrition.carbs}g</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">glucides</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="text-lg font-bold text-white">{analysis.nutrition.fats}g</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">lipides</div>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-zinc-300">Conseils clés</h4>
            <ul className="space-y-1.5 text-sm text-zinc-400">
              {analysis.nutrition.advice.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold text-zinc-300">Exemple de journée type</h4>
            <ul className="space-y-2">
              {analysis.nutrition.sample.map((m) => (
                <li key={m.label} className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-sm">
                  <div className="font-medium text-amber-400">{m.label}</div>
                  <div className="text-zinc-400">{m.example}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
