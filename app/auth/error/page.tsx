import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] px-4 text-center">
      <h1 className="font-display text-2xl font-bold text-[var(--text)] mb-2">
        Sign-in failed
      </h1>
      <p className="font-mono text-sm text-[var(--text-muted)] mb-6">
        Something went wrong while signing you in. Please try again.
      </p>
      <Link
        href="/"
        className="font-mono font-semibold text-sm bg-[var(--surface)] hover:bg-[#facc15] text-[var(--text)] hover:text-black border-2 border-black rounded-full shadow-[3px_3px_0_0_#000] px-4 py-1.5 active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000] transition-colors"
      >
        Back to game
      </Link>
    </main>
  );
}
