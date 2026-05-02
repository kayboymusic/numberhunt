'use client';
import { useGameStore } from '@/lib/store/gameStore';

export default function HowToPlay() {
  const showHelp = useGameStore((s) => s.showHelp);
  const toggleHelp = useGameStore((s) => s.toggleHelp);
  if (!showHelp) return null;

  return (
    <div
      onClick={toggleHelp}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-md
          bg-[var(--surface)] text-[var(--text)]
          border-[3px] border-black rounded-xl
          shadow-[6px_6px_0_0_#000]
          p-5 sm:p-6
          max-h-[85vh] overflow-y-auto
        "
      >
        <button
          onClick={toggleHelp}
          aria-label="Close how to play"
          className="
            absolute top-3 right-3
            w-8 h-8 flex items-center justify-center
            bg-white text-black hover:bg-[#facc15]
            border-2 border-black rounded-md
            shadow-[2px_2px_0_0_#000]
            active:[transform:translate(2px,2px)] active:shadow-[0_0_0_0_#000]
            transition-colors duration-75
            cursor-pointer font-bold text-sm
          "
        >
          ✕
        </button>

        <h3 className="font-display font-bold tracking-wider text-lg mb-3 pr-8">
          How to play
        </h3>

        <p className="font-mono text-sm mb-4">
          Guess today&apos;s hidden equation in 6 tries. Easy mode uses 8
          characters; Hard mode uses 10.
        </p>

        <ul className="font-mono text-sm space-y-1.5 mb-4 list-disc list-inside marker:text-[var(--text-muted)]">
          <li>Use digits <span className="font-bold">0–9</span> and operators <span className="font-bold">+ − × ÷ =</span>.</li>
          <li>Each guess must be a valid equation (left side equals right side).</li>
          <li>Order of operations applies — <span className="font-bold">×</span> and <span className="font-bold">÷</span> bind tighter than <span className="font-bold">+</span> and <span className="font-bold">−</span>.</li>
          <li>No leading zeros (e.g. <span className="font-bold">07</span> is not allowed).</li>
        </ul>

        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
          Tile colors
        </p>
        <div className="space-y-1.5 mb-4 text-sm font-mono">
          <Legend swatchClass="bg-[#538d4e]" label="Right symbol, right spot" />
          <Legend swatchClass="bg-[#b59f3b]" label="Right symbol, wrong spot" />
          <Legend swatchClass="bg-[var(--tile-absent)]" label="Not in the equation" />
        </div>

        <p className="font-mono text-xs text-[var(--text-muted)]">
          Example: if the answer is <span className="text-[var(--text)] font-bold">4*9+0=36</span> and you guess <span className="text-[var(--text)] font-bold">3*8+1=25</span>, the <span className="font-bold">3</span>, <span className="font-bold">*</span>, <span className="font-bold">+</span>, and <span className="font-bold">=</span> appear in both — but only some land on the right tile.
        </p>
      </div>
    </div>
  );
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`inline-block w-5 h-5 rounded-sm border border-black ${swatchClass}`} />
      <span>{label}</span>
    </div>
  );
}
