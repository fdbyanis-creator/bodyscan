// Pseudo "AI" body analyzer. Deterministic from file fingerprint
// so the same photo always returns the same plan — gives a realistic feel.

export type Priority = "Haute" | "Moyenne" | "Faible";

export interface Exercise {
  name: string;
  sets: string;
  rest: string;
  tip: string;
}

export interface ZonePlan {
  zone: string;
  priority: Priority;
  reason: string;
  exercises: Exercise[];
}

export interface Supplement {
  name: string;
  dose: string;
  why: string;
}

export interface Meal {
  label: string;
  example: string;
}

export interface Analysis {
  morphotype: "Ectomorphe" | "Mésomorphe" | "Endomorphe";
  morphoDesc: string;
  bodyFat: number;
  bodyFatRange: string;
  bodyFatBracket: "Athlétique" | "Fitness" | "Moyen" | "Au‑dessus de la moyenne";
  muscleMass: number; // 0-100 score
  posture: number; // 0-100 score
  symmetry: number; // 0-100 score
  summary: string;
  zones: ZonePlan[];
  supplements: Supplement[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    advice: string[];
    sample: Meal[];
  };
}

// Deterministic pseudo-random based on a numeric seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const exercisePool: Record<string, Exercise[]> = {
  "Pectoraux": [
    { name: "Développé couché haltères incliné", sets: "4 × 8‑10", rest: "90 s", tip: "Coudes à 45°, descente lente sur 3 secondes." },
    { name: "Pompes lestées", sets: "4 × 12", rest: "60 s", tip: "Gainage actif, omoplates serrées." },
    { name: "Écarté poulie bas vers haut", sets: "3 × 12‑15", rest: "60 s", tip: "Cible la partie haute des pectoraux." },
  ],
  "Dos & posture": [
    { name: "Tirage horizontal poulie", sets: "4 × 10", rest: "75 s", tip: "Tire vers le nombril, scapulas en arrière." },
    { name: "Face pull", sets: "4 × 15", rest: "45 s", tip: "Excellent pour épaules saines et posture." },
    { name: "Soulevé de terre roumain", sets: "4 × 8", rest: "120 s", tip: "Charge progressive, dos neutre." },
  ],
  "Épaules": [
    { name: "Développé militaire haltères", sets: "4 × 8‑10", rest: "90 s", tip: "Ne pas verrouiller les coudes en haut." },
    { name: "Élévations latérales", sets: "4 × 12‑15", rest: "45 s", tip: "Léger, tempo contrôlé, ne pas balancer." },
    { name: "Rear delt fly", sets: "3 × 15", rest: "45 s", tip: "Indispensable pour équilibrer le devant." },
  ],
  "Bras": [
    { name: "Curl haltères alterné", sets: "4 × 10", rest: "60 s", tip: "Supination en fin de course." },
    { name: "Dips lestés", sets: "4 × 8‑10", rest: "90 s", tip: "Buste droit pour cibler les triceps." },
    { name: "Curl marteau", sets: "3 × 12", rest: "45 s", tip: "Travaille le brachial pour l'épaisseur." },
  ],
  "Jambes": [
    { name: "Squat barre", sets: "5 × 5", rest: "150 s", tip: "Descente complète, genoux alignés." },
    { name: "Fentes bulgares", sets: "3 × 10/jambe", rest: "75 s", tip: "Corrige les déséquilibres droite/gauche." },
    { name: "Leg curl allongé", sets: "4 × 12", rest: "60 s", tip: "Ne néglige pas les ischios." },
  ],
  "Mollets": [
    { name: "Extension mollets debout", sets: "5 × 15", rest: "45 s", tip: "Amplitude max, pause d'1 s en haut." },
    { name: "Extension mollets assis", sets: "4 × 20", rest: "45 s", tip: "Cible le soléaire." },
  ],
  "Abdominaux & gainage": [
    { name: "Gainage planche", sets: "4 × 60 s", rest: "45 s", tip: "Bassin rétroversé, fessiers contractés." },
    { name: "Relevé de jambes suspendu", sets: "4 × 12", rest: "60 s", tip: "Contrôle la descente." },
    { name: "Roue abdominale", sets: "3 × 8‑10", rest: "75 s", tip: "Garde le dos rond, ne creuse pas." },
  ],
  "Cardio & condition": [
    { name: "HIIT vélo / rameur", sets: "10 × 30 s effort / 30 s repos", rest: "—", tip: "2 à 3 séances par semaine maximum." },
    { name: "Marche rapide en pente", sets: "30‑45 min", rest: "—", tip: "Brûle les graisses sans cataboliser." },
  ],
};

function pickExercises(zone: string, rand: () => number, n = 3): Exercise[] {
  const pool = [...(exercisePool[zone] ?? [])];
  const out: Exercise[] = [];
  while (out.length < Math.min(n, pool.length)) {
    const i = Math.floor(rand() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export function analyzeFromFile(file: File): Promise<Analysis> {
  // Simulate processing time
  return new Promise((resolve) => {
    const seed = hashString(`${file.name}-${file.size}-${file.lastModified}`);
    const rand = mulberry32(seed);

    setTimeout(() => resolve(buildAnalysis(rand)), 2200);
  });
}

function buildAnalysis(rand: () => number): Analysis {
  const morphoRoll = rand();
  const morphotype =
    morphoRoll < 0.34 ? "Ectomorphe" : morphoRoll < 0.7 ? "Mésomorphe" : "Endomorphe";

  const morphoDesc =
    morphotype === "Ectomorphe"
      ? "Ossature fine, métabolisme rapide. Prise de muscle plus lente mais corps sec naturellement."
      : morphotype === "Mésomorphe"
        ? "Structure athlétique, bonne réponse à l'entraînement. Prise de muscle et de force rapide."
        : "Carrure large, stockage des graisses plus facile. Excellent potentiel de force.";

  // Body fat estimation
  const baseBf =
    morphotype === "Ectomorphe" ? 11 : morphotype === "Mésomorphe" ? 15 : 21;
  const bodyFat = Math.round((baseBf + rand() * 7) * 10) / 10;
  const bodyFatRange = `${(bodyFat - 1.5).toFixed(1)}% – ${(bodyFat + 1.5).toFixed(1)}%`;
  const bodyFatBracket: Analysis["bodyFatBracket"] =
    bodyFat < 12 ? "Athlétique" : bodyFat < 17 ? "Fitness" : bodyFat < 22 ? "Moyen" : "Au‑dessus de la moyenne";

  const muscleMass = Math.round(45 + rand() * 45);
  const posture = Math.round(50 + rand() * 45);
  const symmetry = Math.round(55 + rand() * 40);

  // Build prioritized zones
  const allZones = Object.keys(exercisePool);
  const scored = allZones.map((z) => ({ z, score: rand() }));
  // Bias toward zones typically weak per morphotype
  const weakBias: Record<string, string[]> = {
    Ectomorphe: ["Pectoraux", "Jambes", "Épaules"],
    Mésomorphe: ["Dos & posture", "Bras", "Abdominaux & gainage"],
    Endomorphe: ["Cardio & condition", "Abdominaux & gainage", "Dos & posture"],
  };
  for (const z of scored) {
    if (weakBias[morphotype].includes(z.z)) z.score += 0.5;
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 4);

  const reasons: Record<string, string> = {
    "Pectoraux": "Volume pectoral inférieur à la moyenne, partie haute creuse.",
    "Dos & posture": "Épaules légèrement enroulées, dos à renforcer pour rééquilibrer.",
    "Épaules": "Manque de largeur visible — les deltoïdes latéraux sont à prioriser.",
    "Bras": "Bras en retard sur le reste du buste, à rattraper.",
    "Jambes": "Décalage haut/bas du corps, quadriceps et fessiers à développer.",
    "Mollets": "Mollets fins par rapport au reste de la jambe.",
    "Abdominaux & gainage": "Sangle abdominale peu visible, gainage profond à renforcer.",
    "Cardio & condition": "Tissu adipeux à réduire pour révéler la musculature.",
  };

  const priorities: Priority[] = ["Haute", "Haute", "Moyenne", "Faible"];

  const zones: ZonePlan[] = top.map((t, i) => ({
    zone: t.z,
    priority: priorities[i],
    reason: reasons[t.z] ?? "Zone à renforcer pour un physique équilibré.",
    exercises: pickExercises(t.z, rand, 3),
  }));

  // Supplements depending on profile
  const supplements: Supplement[] = [
    {
      name: "Whey isolate",
      dose: "30 g post‑training + 1 shake collation",
      why: "Atteindre tes 1,8 g/kg de protéines facilement, récupération musculaire optimale.",
    },
    {
      name: "Créatine monohydrate",
      dose: "5 g / jour, tous les jours",
      why: "Le supplément le mieux validé scientifiquement — +5 à 10% de force en 4 semaines.",
    },
    {
      name: "Oméga‑3 EPA/DHA",
      dose: "2 g / jour pendant un repas",
      why: "Anti‑inflammatoire, récupération articulaire, santé cardiovasculaire.",
    },
    {
      name: "Vitamine D3 + K2",
      dose: "2000 UI / jour",
      why: "Carence très fréquente — impacte testostérone, force et immunité.",
    },
  ];
  if (morphotype === "Endomorphe") {
    supplements.push({
      name: "L‑Carnitine",
      dose: "2 g avant cardio",
      why: "Soutient l'utilisation des graisses comme source d'énergie.",
    });
  }
  if (morphotype === "Ectomorphe") {
    supplements.push({
      name: "Gainer maison (avoine + whey + banane)",
      dose: "+500 kcal entre les repas",
      why: "Augmente l'apport calorique sans saturer l'estomac.",
    });
  }

  // Nutrition macros (assume ~75kg male reference)
  const kcalBase =
    morphotype === "Ectomorphe" ? 3000 : morphotype === "Mésomorphe" ? 2600 : 2200;
  const calories = kcalBase + Math.round(rand() * 200);
  const protein = Math.round(75 * 1.9);
  const fats = Math.round((calories * 0.27) / 9);
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4);

  const advice: string[] = [
    morphotype === "Endomorphe"
      ? "Léger déficit calorique (‑300 kcal) pour fondre tout en gardant le muscle."
      : morphotype === "Ectomorphe"
        ? "Surplus calorique de +400 kcal — manger toutes les 3 h."
        : "Maintenance ou très léger surplus pour une recomposition corporelle.",
    "Vise au minimum 1,8 g de protéines par kilo de poids de corps chaque jour.",
    "Bois 35 ml d'eau par kg de poids de corps — soit ~2,6 L pour 75 kg.",
    "Privilégie les aliments bruts : 80% du diet, 20% de plaisir.",
    "Coupe les sucres liquides (sodas, jus) — gain net immédiat.",
  ];

  const sample: Meal[] = [
    { label: "Petit‑déjeuner", example: "Flocons d'avoine 80 g + 3 œufs + 1 banane + amandes" },
    { label: "Déjeuner", example: "Poulet 180 g + riz basmati 100 g cru + légumes verts + huile d'olive" },
    { label: "Collation", example: "Skyr 250 g + fruits rouges + 30 g de noix" },
    { label: "Post‑training", example: "Shake whey 30 g + 1 fruit + 50 g de pain complet" },
    { label: "Dîner", example: "Saumon 180 g + patate douce 200 g + brocolis vapeur" },
  ];

  const summary = `Profil ${morphotype.toLowerCase()} avec un taux de masse grasse estimé autour de ${bodyFat}% (${bodyFatBracket.toLowerCase()}). Tes priorités sont claires : ${top
    .slice(0, 2)
    .map((t) => t.z.toLowerCase())
    .join(" et ")}. Suis le plan ci‑dessous pendant 8 semaines, puis re‑scanne‑toi pour mesurer la progression.`;

  return {
    morphotype,
    morphoDesc,
    bodyFat,
    bodyFatRange,
    bodyFatBracket,
    muscleMass,
    posture,
    symmetry,
    summary,
    zones,
    supplements,
    nutrition: { calories, protein, carbs, fats, advice, sample },
  };
}
