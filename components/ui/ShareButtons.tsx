'use client';
import { useGameStore } from '@/lib/store/gameStore';

interface Props {
  text: string;
}

export default function ShareButtons({ text }: Props) {
  const flashToast = (msg: string) => useGameStore.setState({ toast: msg });

  const handleX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleTelegram = () => {
    const url = window.location.href;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flashToast('Copied! Paste in Instagram');
    } catch {
      flashToast('Could not copy to clipboard');
    }
  };

  const buttons: { label: string; onClick: () => void; icon: React.ReactNode }[] = [
    { label: 'X', onClick: handleX, icon: <XIcon /> },
    { label: 'WhatsApp', onClick: handleWhatsApp, icon: <WhatsAppIcon /> },
    { label: 'Telegram', onClick: handleTelegram, icon: <TelegramIcon /> },
    { label: 'Instagram', onClick: handleInstagram, icon: <InstagramIcon /> },
  ];

  return (
    <div className="flex items-center justify-center gap-2.5 mt-1">
      {buttons.map((b) => (
        <button
          key={b.label}
          onClick={b.onClick}
          aria-label={`Share to ${b.label}`}
          className="
            w-11 h-11 flex items-center justify-center
            bg-white text-black
            border-2 border-black rounded-lg
            shadow-[3px_3px_0_0_#000]
            hover:bg-[#facc15]
            active:[transform:translate(3px,3px)] active:shadow-[0_0_0_0_#000]
            transition-colors duration-75
            cursor-pointer
          "
        >
          {b.icon}
        </button>
      ))}
    </div>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057.001C5.405.001.005 5.404 0 12.057c-.003 2.197.583 4.34 1.713 6.226L0 24l5.892-1.665a11.92 11.92 0 005.7 1.482h.005c6.652 0 12.052-5.404 12.055-12.057.005-3.225-1.246-6.255-3.526-8.535A12.066 12.066 0 0012.057.001zm0 21.815h-.004a9.964 9.964 0 01-5.04-1.378l-.362-.215-3.749 1.058 1.005-3.74-.236-.388a9.93 9.93 0 01-1.516-5.305c.003-5.531 4.504-10.03 10.034-10.03a9.963 9.963 0 017.094 2.94 9.95 9.95 0 012.937 7.097c-.003 5.531-4.504 10.03-10.033 10.03z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.466.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
