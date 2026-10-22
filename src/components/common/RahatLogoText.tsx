import React from 'react';

interface RahatLogoTextProps {
  className?: string;
  color?: string; // Default to Dark Blue
  height?: number | string;
  showSubtitle?: boolean;
}

/**
 * RahatLogoText
 * Renders "RAHAT" in Google Font "Luckiest Guy" (Designed by Astigmatic) in Dark Blue (#3A0CA3).
 */
export const RahatLogoText: React.FC<RahatLogoTextProps> = ({
  className = '',
  color = '#141478', // Dark Navy Blue #141478
  showSubtitle = false,
}) => {
  return (
    <div className={`inline-flex flex-col select-none justify-center leading-none ${className}`}>
      <span
        className="rahat-logo-font select-none tracking-[0.06em]"
        style={{
          fontFamily: "'Luckiest Guy', cursive, sans-serif",
          color: color || '#141478',
        }}
      >
        RAHAT
      </span>
      {showSubtitle && (
        <span className="text-[9px] font-bold text-[#516C8A] uppercase tracking-wider mt-0.5">
          Disaster Operations
        </span>
      )}
    </div>
  );
};
