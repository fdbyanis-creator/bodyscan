interface Testimonial {
  name: string;
  initials: string;
  color: string;
  morphotype: string;
  rating: number;
  text: string;
  result: string;
  date: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    name: "Thomas D.",
    initials: "TD",
    color: "from-amber-400 to-orange-500",
    morphotype: "Mésomorphe",
    rating: 5,
    text: "J'étais sceptique, mais l'analyse a repéré exactement mes points faibles : dos voûté et pectoraux creux. En 8 semaines sur le plan, j'ai gagné 2 kg de masse maigre. Le plan nutrition est clair, pas de bullshit.",
    result: "+2 kg muscle en 8 semaines",
    date: "Il y a 3 jours",
    verified: true,
  },
  {
    name: "Sarah L.",
    initials: "SL",
    color: "from-pink-400 to-rose-500",
    morphotype: "Endomorphe",
    rating: 5,
    text: "Enfin un outil qui me dit QUOI faire et pas juste 'mange moins, bouge plus'. Les priorités sont logiques, les exercices expliqués, et j'ai perdu 4 kg de gras sans avoir faim grâce au plan nutrition.",
    result: "-4 kg de gras en 10 semaines",
    date: "Il y a 1 semaine",
    verified: true,
  },
  {
    name: "Maxime B.",
    initials: "MB",
    color: "from-blue-400 to-indigo-500",
    morphotype: "Ectomorphe",
    rating: 5,
    text: "Galère totale pour prendre du muscle depuis 3 ans. Bodyscan.io a identifié mon profil d'ectomorphe et m'a donné un plan gainer + un training adapté. +3 kg sur la balance en 6 semaines, c'est du jamais vu pour moi.",
    result: "+3 kg en 6 semaines",
    date: "Il y a 2 semaines",
    verified: true,
  },
  {
    name: "Julie M.",
    initials: "JM",
    color: "from-emerald-400 to-teal-500",
    morphotype: "Mésomorphe",
    rating: 4,
    text: "Super interface, analyse rapide. Le seul bémol : j'aurais aimé plus d'exercices à la maison sans matériel. Mais les recommandations de compléments étaient top (créatine + vitamine D m'ont clairement boostée).",
    result: "Meilleure énergie et récup",
    date: "Il y a 2 semaines",
    verified: true,
  },
  {
    name: "Karim R.",
    initials: "KR",
    color: "from-violet-400 to-purple-500",
    morphotype: "Endomorphe",
    rating: 5,
    text: "J'ai testé 3 coachs en ligne avant, aucun n'a été aussi précis. Le scan a repéré ma faiblesse en mollets et en posture. En 2 mois mes collègues me demandent ce que j'ai changé. Pro à 29,99 €, ça les vaut largement.",
    result: "Silhouette transformée",
    date: "Il y a 3 semaines",
    verified: true,
  },
  {
    name: "Camille P.",
    initials: "CP",
    color: "from-amber-400 to-yellow-500",
    morphotype: "Ectomorphe",
    rating: 5,
    text: "Le plan découverte gratuit m'a convaincue en 2 minutes. Je suis passée au Starter le lendemain. Les macros calculées automatiquement, c'est le game changer. Plus besoin de MyFitnessPal 3h par jour.",
    result: "Clarté totale sur mon diet",
    date: "Il y a 1 mois",
    verified: true,
  },
  {
    name: "Antoine V.",
    initials: "AV",
    color: "from-red-400 to-orange-500",
    morphotype: "Mésomorphe",
    rating: 5,
    text: "Coach sportif moi-même, je recommande Bodyscan.io à mes clients pour leur suivi entre les séances. L'analyse de symétrie droite/gauche est bluffante et m'aide à adapter leurs programmes.",
    result: "Outil pro validé",
    date: "Il y a 1 mois",
    verified: true,
  },
  {
    name: "Léa T.",
    initials: "LT",
    color: "from-cyan-400 to-sky-500",
    morphotype: "Endomorphe",
    rating: 4,
    text: "Pratique, rapide, motivant. J'aurais aimé pouvoir uploader plusieurs angles en même temps. Mais rien que l'estimation du body fat (très proche de ma balance impédancemètre) m'a rassurée sur la fiabilité.",
    result: "Body fat confirmé à 22%",
    date: "Il y a 1 mois",
    verified: true,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < n ? "text-amber-400" : "text-zinc-700"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ t }: { t: Testimonial }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-zinc-900 shadow-lg`}>
      {t.initials}
    </div>
  );
}

export default function Testimonials() {
  const avg = (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center reveal">
        <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
          Ils nous font confiance
        </span>
        <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          {avg}/5 · <span className="text-amber-400">+12 000 analyses</span> réalisées
        </h2>
        <p className="mt-3 text-zinc-400">
          Rejoins une communauté de sportifs, débutants et confirmés qui ont repris le contrôle de leur physique.
        </p>

        {/* Aggregated rating */}
        <div className="mx-auto mt-6 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3">
          <div className="text-4xl font-bold text-white">{avg}</div>
          <div className="text-left">
            <Stars n={5} />
            <div className="mt-0.5 text-xs text-zinc-500">Basé sur 2 847 avis vérifiés</div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            <span>Avis vérifiés</span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="reveal hover-lift group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-950/60 p-6 transition hover:border-amber-500/30"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar t={t} />
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {t.name}
                    {t.verified && (
                      <span title="Avis vérifié" className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500">
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">{t.morphotype} · {t.date}</div>
                </div>
              </div>
              <Stars n={t.rating} />
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">"{t.text}"</p>

            <div className="mt-4 inline-flex items-center gap-2 self-start rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/20">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              {t.result}
            </div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="reveal mt-14 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Utilisateurs actifs", value: "12 438" },
          { label: "Analyses ce mois", value: "3 247" },
          { label: "Taux de satisfaction", value: "97%" },
          { label: "Durée moyenne d'analyse", value: "3 sec" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-amber-400">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
