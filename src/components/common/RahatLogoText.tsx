import React from 'react';

interface RahatLogoTextProps {
  className?: string;
  color?: string; // Default to Dark Blue
  height?: number | string;
  showSubtitle?: boolean;
}

/**
 * RahatLogoText
 * Renders "RAHAT" styled in the exact geometric display typeface
 * from the NURA font family (heavy monoline stroke, signature arch 'A',
 * geometric 'R', 'H', and 'T') in authoritative Dark Blue (#0A2342).
 */
export const RahatLogoText: React.FC<RahatLogoTextProps> = ({
  className = 'h-6',
  color = '#0A2342', // Dark Blue
  height,
}) => {
  return (
    <svg
      viewBox="0 0 484 100"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      style={height ? { height } : undefined}
      aria-label="RAHAT"
      role="img"
    >
      {/* 
        R - Width: 84, Offset: 0
        Features straight vertical left stem, rounded upper bowl, 
        and angled right leg with flat baseline cut
      */}
      <path
        d="M 0 0 L 52 0 C 72 0 84 12 84 28 C 84 43 72 54 54 56 L 46 56 L 76 100 L 49 100 L 23 58 L 23 100 L 0 100 Z M 23 21 L 50 21 C 57 21 61 24 61 28 C 61 32 57 36 50 36 L 23 36 Z"
        fill={color}
      />

      {/* 
        A (First) - Width: 84, Offset: 100
        Signature NURA arch: rounded dome top with vertical legs and horizontal crossbar
      */}
      <path
        d="M 100 100 L 100 42 C 100 19 119 0 142 0 C 165 0 184 19 184 42 L 184 100 L 161 100 L 161 74 L 123 74 L 123 100 Z M 123 54 L 161 54 L 161 42 C 161 31 152 22 142 22 C 132 22 123 31 123 42 Z"
        fill={color}
      />

      {/* 
        H - Width: 84, Offset: 200
        Two vertical monoline stems connected by centered horizontal crossbar
      */}
      <path
        d="M 200 0 L 223 0 L 223 39 L 261 39 L 261 0 L 284 0 L 284 100 L 261 100 L 261 61 L 223 61 L 223 100 L 200 100 Z"
        fill={color}
      />

      {/* 
        A (Second) - Width: 84, Offset: 300
        Signature NURA arch (matching first 'A')
      */}
      <path
        d="M 300 100 L 300 42 C 300 19 319 0 342 0 C 365 0 384 19 384 42 L 384 100 L 361 100 L 361 74 L 323 74 L 323 100 Z M 323 54 L 361 54 L 361 42 C 361 31 352 22 342 22 C 332 22 323 31 323 42 Z"
        fill={color}
      />

      {/* 
        T - Width: 84, Offset: 400
        Wide top bar with centered vertical monoline stem
      */}
      <path
        d="M 400 0 L 484 0 L 484 22 L 453 22 L 453 100 L 431 100 L 431 22 L 400 22 Z"
        fill={color}
      />
    </svg>
  );
};
