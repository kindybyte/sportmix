import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const TelegramIcon = (p: P) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.94 4.3a1 1 0 0 0-1.05-.16L3.4 11.3c-.86.36-.8 1.6.09 1.87l4.36 1.36 1.7 5.06c.25.74 1.2.92 1.7.32l2.3-2.77 4.3 3.16c.6.44 1.46.12 1.62-.6l3.1-14.4a1 1 0 0 0-.63-1zM9.7 14.1l8.2-5.1-6.55 6.04a1 1 0 0 0-.3.6l-.27 2.2-1.08-3.74z" />
  </svg>
);

export const WhatsappIcon = (p: P) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.08-1.33A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.84 12.7l-.25.38.6 2.18-2.25-.59-.36.2A8.2 8.2 0 1 1 12 3.8zm-3.2 3.7c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.7 2.7 4.2 3.68 2.07.82 2.5.66 2.95.62.45-.04 1.45-.6 1.65-1.17.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.77.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.34-.76-1.84-.18-.42-.37-.42-.54-.43h-.46z" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5S4 15.5 4 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8c0 5.7-8 10.7-8 10.7z" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const FilterIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </svg>
);

export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const SpoolIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 3h10M7 21h10" />
    <path d="M8 3v18M16 3v18" />
    <path d="M8 8h8M8 12h8M8 16h8" />
  </svg>
);
