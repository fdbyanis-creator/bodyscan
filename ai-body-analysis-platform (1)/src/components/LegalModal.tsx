import { useEffect, useState } from "react";

export type LegalPage = "terms" | "privacy" | "legal";

interface Props {
  open: boolean;
  initialPage: LegalPage;
  onClose: () => void;
}

const SITE_ID = "b373d99cc2c22a5f771e6a81c1b258a0";

function Terms() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <h2 className="text-2xl font-bold text-white">Conditions Générales d'Utilisation</h2>
      <p className="text-xs text-zinc-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <Section title="1. Objet">
        Les présentes CGU régissent l'accès et l'utilisation de <b>Bodyscan.io</b> (ci‑après « le Service »), édité sous l'identifiant unique <code className="rounded bg-white/5 px-1 font-mono text-amber-300">{SITE_ID}</code>.
        Le Service propose une analyse morphologique à partir d'une photographie ainsi que des recommandations d'exercices, de nutrition et de compléments alimentaires.
      </Section>

      <Section title="2. Acceptation">
        L'accès au Service est subordonné à l'acceptation intégrale des présentes CGU lors de l'inscription.
        Si tu n'acceptes pas ces conditions, tu ne peux pas utiliser le Service.
      </Section>

      <Section title="3. Inscription et compte">
        L'inscription est gratuite pour le plan Découverte (1 analyse offerte).
        Tu es responsable de la confidentialité de tes identifiants et de toute activité réalisée depuis ton compte.
        Les plans payants sont souscrits via Stripe. Les abonnements sont mensuels et sans engagement, résiliables à tout moment depuis ton espace.
      </Section>

      <Section title="4. Nature du Service — avertissement médical">
        Bodyscan.io fournit des estimations basées sur une analyse visuelle par intelligence artificielle.
        Ces informations sont données à titre indicatif et <b className="text-amber-300">ne constituent ni un avis médical, ni un diagnostic, ni une prescription</b>.
        Consulte systématiquement un médecin, nutritionniste ou coach sportif diplômé avant d'entreprendre un programme d'entraînement, un régime ou une prise de compléments alimentaires.
        Le Service ne remplace pas un professionnel de santé.
      </Section>

      <Section title="5. Obligations de l'utilisateur">
        Tu t'engages à ne pas utiliser le Service à des fins illicites, à ne télécharger que des photos dont tu es le sujet ou pour lesquelles tu disposes du consentement exprès des personnes concernées, et à ne pas tenter de perturber le bon fonctionnement de la plateforme.
      </Section>

      <Section title="6. Tarifs et paiements">
        Les prix affichés sont toutes taxes comprises.
        Les paiements sont traités de manière sécurisée par Stripe. Aucune information bancaire ne transite par nos serveurs.
        Tu disposes d'un droit de rétractation de 14 jours conformément à la législation applicable.
      </Section>

      <Section title="7. Résiliation">
        Tu peux résilier ton abonnement à tout moment. La résiliation prend effet à la fin de la période en cours.
        Nous nous réservons le droit de suspendre ou résilier tout compte en cas de violation des présentes CGU.
      </Section>

      <Section title="8. Propriété intellectuelle">
        L'ensemble du contenu du Service (textes, logos, code, interface, algorithmes) est protégé par le droit d'auteur.
        Les photos téléchargées restent ta propriété ; tu nous concèdes une licence d'utilisation limitée à la fourniture du Service.
      </Section>

      <Section title="9. Limitation de responsabilité">
        Le Service est fourni « en l'état » sans garantie d'exactitude.
        Nous ne saurions être tenus responsables de tout dommage direct ou indirect résultant de l'utilisation des recommandations fournies.
      </Section>

      <Section title="10. Droit applicable et litiges">
        Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux juridictions compétentes.
      </Section>
    </div>
  );
}

function Privacy() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <h2 className="text-2xl font-bold text-white">Politique de confidentialité</h2>
      <p className="text-xs text-zinc-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <Section title="1. Responsable du traitement">
        Le responsable du traitement est l'éditeur du service Bodyscan.io (identifiant : <code className="rounded bg-white/5 px-1 font-mono text-amber-300">{SITE_ID}</code>).
      </Section>

      <Section title="2. Données collectées">
        Nous collectons :<br />
        • Données de compte : prénom, adresse e-mail, mot de passe (chiffré) ;<br />
        • Données d'analyse : photo(s) téléchargée(s), résultats de l'analyse morphologique (morphotype, body fat estimé, etc.) ;<br />
        • Données de paiement : traitées exclusivement par Stripe (nous ne stockons jamais ton numéro de carte) ;<br />
        • Données techniques : adresse IP, type d'appareil, pages consultées, à des fins d'amélioration du service.
      </Section>

      <Section title="3. Finalités">
        Tes données sont utilisées pour : fournir les analyses personnalisées, gérer ton abonnement, envoyer des emails de service (pas de publicité sans consentement préalable), améliorer le modèle d'IA, et assurer la sécurité du Service.
      </Section>

      <Section title="4. Conservation des photos">
        Les photos téléchargées <b className="text-amber-300">ne sont pas conservées sur nos serveurs</b>. Elles sont analysées en mémoire puis immédiatement supprimées. Seuls les résultats de l'analyse (données chiffrées agrégées) peuvent être conservés associés à ton compte pour suivre ta progression.
      </Section>

      <Section title="5. Partage avec des tiers">
        Nous ne partageons tes données qu'avec :<br />
        • Stripe (paiement), soumis à sa propre politique de confidentialité ;<br />
        • Nos prestataires d'hébergement et d'e‑mail, liés contractuellement ;<br />
        • Les autorités, lorsque la loi nous y contraint.
      </Section>

      <Section title="6. Tes droits">
        Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'effacement, de portabilité, et d'opposition concernant tes données.
        Tu peux exercer ces droits à tout moment par email à <span className="text-amber-400">privacy@bodyscan.io</span>, ou directement depuis ton compte (bouton « Supprimer mon compte »).
        Tu peux également introduire une réclamation auprès de la CNIL.
      </Section>

      <Section title="7. Cookies">
        Nous utilisons uniquement des cookies techniques strictement nécessaires au fonctionnement du Service (session, authentification).
        Aucun cookie publicitaire tiers n'est déposé.
      </Section>

      <Section title="8. Sécurité">
        Les mots de passe sont hashés (bcrypt/argon2), les connexions sont chiffrées en HTTPS/TLS 1.3, et l'accès aux bases de données est strictement réservé.
      </Section>
    </div>
  );
}

function Legal() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
      <h2 className="text-2xl font-bold text-white">Mentions légales</h2>
      <p className="text-xs text-zinc-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <Section title="Éditeur">
        <span className="font-semibold text-white">Bodyscan.io</span><br />
        Identifiant unique du site : <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-amber-300">{SITE_ID}</code><br />
        Email de contact : <span className="text-amber-400">hello@bodyscan.io</span>
      </Section>

      <Section title="Directeur de la publication">
        L'éditeur du service, en sa qualité de responsable de la publication.
      </Section>

      <Section title="Hébergement">
        Le Service est hébergé par un prestataire cloud tiers (certifié SOC 2 / RGPD).
        Les coordonnées de l'hébergeur peuvent être communiquées sur simple demande par email.
      </Section>

      <Section title="Paiements">
        Les paiements sont sécurisés et traités exclusivement par <b>Stripe</b>, prestataire certifié PCI‑DSS niveau 1.
        Aucune donnée bancaire ne transite ou n'est stockée sur nos serveurs.
      </Section>

      <Section title="Propriété intellectuelle">
        Le nom « Bodyscan.io », le logo et l'ensemble des éléments du site sont la propriété exclusive de l'éditeur.
      </Section>

      <Section title="Contact">
        Pour toute question, réclamation ou signalement : <span className="text-amber-400">support@bodyscan.io</span>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-1 text-zinc-300/90">{children}</div>
    </div>
  );
}

export default function LegalModal({ open, initialPage, onClose }: Props) {
  const [page, setPage] = useState<LegalPage>(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative my-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-white/10 bg-zinc-950/95 px-6 py-4 backdrop-blur">
          <div className="flex gap-1.5">
            <TabButton active={page === "terms"} onClick={() => setPage("terms")}>CGU</TabButton>
            <TabButton active={page === "privacy"} onClick={() => setPage("privacy")}>Confidentialité</TabButton>
            <TabButton active={page === "legal"} onClick={() => setPage("legal")}>Mentions légales</TabButton>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 md:p-8">
          {page === "terms" && <Terms />}
          {page === "privacy" && <Privacy />}
          {page === "legal" && <Legal />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-amber-500 text-zinc-900"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
