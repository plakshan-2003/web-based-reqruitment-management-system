import React from 'react';

interface LogoProps {
  showEmblem?: boolean;
  className?: string;
  textSize?: string;
}

export const CareerLinkLogo: React.FC<LogoProps> = ({
  showEmblem = true,
  className = '',
  textSize = 'text-xl'
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {showEmblem && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-xs shrink-0 text-white">
          {/* Stylized Sri Lankan Lion Emblem */}
          <svg className="w-5 h-5 text-amber-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 4.5c-.8 0-1.5.4-1.9 1-1.2-.5-2.6-.5-3.8 0-.4-.6-1.1-1-1.9-1-1.3 0-2.4 1-2.4 2.3 0 .4.1.8.3 1.1C7.8 8.8 6 11.2 6 14c0 1.2.3 2.3.9 3.3L5 19h3.2c.8.6 1.7 1 2.8 1 2.8 0 5-2.2 5-5 0-.5-.1-1-.2-1.5 1.5-.6 2.7-1.8 3.2-3.3.7-.3 1.2-1 1.2-1.8 0-1.4-1-2.4-2.3-2.4l-.4.1c-.2-.6-.6-1.1-1.2-1.4.1-.1.2-.2.2-.2zM12 18c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
          </svg>
        </div>
      )}
      <span className={`font-bold tracking-tight text-white ${textSize}`}>
        Career<span className="text-amber-400">Link</span>
      </span>
    </div>
  );
};
