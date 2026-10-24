import React from 'react';

/**
 * QbitLogo — Clean, Modern Brand Insignia for Q-BIT '26
 * Minimal, bold, and authoritative:
 * - Clean italic geometry matching the official mark
 * - Solid collegiate emerald and warm champagne gold
 * - Signature 'Q' with diagonal gold tail
 * - Perfectly spaced ''26' edition accent
 */
export default function QbitLogo({ className = '' }) {
  return (
    <div
      className={`qbit-logo-wrap ${className}`}
      role="img"
      aria-label="Q-BIT '26"
    >
      <svg
        viewBox="0 0 375 72"
        className="qbit-logo-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Rich Collegiate Emerald */}
          <linearGradient id="qbitEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#226b48" />
            <stop offset="60%" stopColor="#134c32" />
            <stop offset="100%" stopColor="#0a2e1d" />
          </linearGradient>

          {/* Warm Champagne Gold */}
          <linearGradient id="qbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7d472" />
            <stop offset="50%" stopColor="#e5a824" />
            <stop offset="100%" stopColor="#be820e" />
          </linearGradient>

          {/* Fine Gold Rim Accent */}
          <linearGradient id="qbitGoldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fae59a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c4891b" stopOpacity="0.4" />
          </linearGradient>

          {/* Subtle Clean Shadow */}
          <filter id="qbitCleanShadow" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#qbitCleanShadow)" transform="skewX(-10) translate(12, 0)">
          {/* 1. THE 'Q' */}
          <g transform="translate(4, 4)">
            {/* Emerald Ring */}
            <path
              d="M 34 4 C 51 4 64 17 64 33 C 64 49 51 62 34 62 C 17 62 4 49 4 33 C 4 17 17 4 34 4 Z M 34 16 C 24 16 16 23.5 16 33 C 16 42.5 24 50 34 50 C 44 50 52 42.5 52 33 C 52 23.5 44 16 34 16 Z"
              fill="url(#qbitEmerald)"
              stroke="url(#qbitGoldEdge)"
              strokeWidth="0.8"
              fillRule="evenodd"
            />
            {/* Solid Gold Diagonal Tail */}
            <polygon
              points="28,42 41,30 71,61 57,71"
              fill="url(#qbitGold)"
            />
          </g>

          {/* 2. HYPHEN '-' */}
          <rect
            x="84"
            y="32"
            width="18"
            height="9"
            rx="2"
            fill="url(#qbitGold)"
          />

          {/* 3. 'BIT' */}
          <text
            x="110"
            y="54"
            fontFamily="'Montserrat', 'Arial Black', 'Poppins', sans-serif"
            fontWeight="900"
            fontSize="52"
            letterSpacing="2"
            fill="url(#qbitEmerald)"
            stroke="url(#qbitGoldEdge)"
            strokeWidth="0.8"
          >
            BIT
          </text>

          {/* 4. ''26' — Cleanly Spaced by 26px */}
          <text
            x="242"
            y="54"
            fontFamily="'Montserrat', 'Arial Black', 'Poppins', sans-serif"
            fontWeight="900"
            fontSize="52"
            letterSpacing="1"
            fill="url(#qbitGold)"
          >
            '26
          </text>
        </g>
      </svg>
    </div>
  );
}
