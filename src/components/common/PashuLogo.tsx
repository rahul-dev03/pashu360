import React from 'react';

interface PashuLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export const PashuLogo: React.FC<PashuLogoProps> = ({
  size = 48,
  className = '',
  showText = false,
  textColor = 'text-white',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-full flex items-center justify-center shadow-sm select-none"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full rounded-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pashuBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14532D" />
              <stop offset="60%" stopColor="#166534" />
              <stop offset="100%" stopColor="#0B2319" />
            </linearGradient>
            <linearGradient id="pashuRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="pashuGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Base Circle */}
          <circle cx="50" cy="50" r="48" fill="url(#pashuBg)" />
          {/* Subtle glowing outer ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#pashuRing)"
            strokeWidth="2.5"
            strokeDasharray="140 10"
            opacity="0.85"
          />

          {/* Protective Care Shield */}
          <path
            d="M50 18 L73 28 C73 52 50 78 50 78 C50 78 27 52 27 28 Z"
            fill="#14532D"
            stroke="url(#pashuRing)"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Stylized Cattle / Cow Face with curved horns */}
          <g transform="translate(25, 28) scale(0.5)">
            {/* Horns */}
            <path
              d="M18 35 C14 18 24 6 36 12 C30 20 28 28 29 36"
              fill="url(#pashuGold)"
            />
            <path
              d="M82 35 C86 18 76 6 64 12 C70 20 72 28 71 36"
              fill="url(#pashuGold)"
            />
            {/* Cow Head Base */}
            <path
              d="M30 35 C30 25 70 25 70 35 C75 42 74 62 65 74 C58 82 42 82 35 74 C26 62 25 42 30 35 Z"
              fill="#FFFFFF"
            />
            {/* Ears */}
            <path
              d="M26 38 C14 38 12 50 24 48 Z"
              fill="#E2E8F0"
            />
            <path
              d="M74 38 C86 38 88 50 76 48 Z"
              fill="#E2E8F0"
            />
            {/* Muzzle */}
            <ellipse cx="50" cy="65" rx="15" ry="11" fill="#F1F5F9" />
            <circle cx="43" cy="65" r="2.2" fill="#166534" />
            <circle cx="57" cy="65" r="2.2" fill="#166534" />
            {/* Gentle Eyes */}
            <ellipse cx="38" cy="45" rx="2.5" ry="3.5" fill="#14532D" />
            <ellipse cx="62" cy="45" rx="2.5" ry="3.5" fill="#14532D" />
            <circle cx="39" cy="44" r="1" fill="#FFFFFF" />
            <circle cx="63" cy="44" r="1" fill="#FFFFFF" />
            {/* Forehead Tilak / Mark */}
            <path
              d="M50 30 L53 38 L47 38 Z"
              fill="#22C55E"
            />
          </g>

          {/* Health Pulse / Cross Indicator at bottom center of shield */}
          <g transform="translate(42, 63)">
            <rect x="6" y="0" width="4" height="15" rx="2" fill="#22C55E" />
            <rect x="0.5" y="5.5" width="15" height="4" rx="2" fill="#22C55E" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-base font-extrabold tracking-tight leading-tight ${textColor}`}>
            Pashu<span className="text-[#22C55E]">360</span>
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            Livestock Healthcare
          </span>
        </div>
      )}
    </div>
  );
};
