import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      alert("Merci d'envoyer une image (JPG ou PNG).");
      return;
    }
    onFile(f);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (disabled) return;
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative rounded-3xl border-2 border-dashed p-10 text-center transition ${
        drag
          ? "border-amber-400 bg-amber-500/10"
          : "border-white/15 bg-white/[0.02] hover:border-amber-400/60 hover:bg-amber-500/[0.04]"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-900/40">
        <svg className="h-7 w-7 text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          <polyline points="7 9 12 4 17 9" />
          <line x1="12" y1="4" x2="12" y2="16" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white">Glisse ta photo ici</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
        Photo de face, bras le long du corps, lumière correcte. Aucune image n'est conservée — l'analyse est faite localement.
      </p>
      <button
        onClick={() => inputRef.current?.click()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400"
      >
        Choisir une image
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
      <p className="mt-4 text-xs text-zinc-500">JPG ou PNG · 10 Mo max</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
