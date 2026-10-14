import React from 'react';

interface CompanyLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ name, size = 'md', className = '' }) => {
  const normalized = name.toLowerCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  // Specific branded styling matching the real companies in Sri Lanka
  if (normalized.includes('virtusa')) {
    return (
      <div className={`rounded-full bg-[#002B49] text-white flex items-center justify-center font-bold tracking-tighter shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="flex items-center">
          <span className="text-cyan-400 font-black">V</span>
          <span className="text-[0.65em] font-medium tracking-normal ml-0.5">virtusa</span>
        </span>
      </div>
    );
  }

  if (normalized.includes('brandix')) {
    return (
      <div className={`rounded-full bg-white border border-red-200 text-[#C62828] flex items-center justify-center font-extrabold tracking-tight shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <div className="flex flex-col items-center leading-none">
          <span className="text-[0.7em] font-black uppercase text-red-600">brandix</span>
          <span className="text-[0.45em] text-slate-500 font-medium">INSPIRED</span>
        </div>
      </div>
    );
  }

  if (normalized.includes('wso2')) {
    return (
      <div className={`rounded-full bg-[#202020] text-[#FF7300] flex items-center justify-center font-black tracking-tight shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="flex items-center text-[0.8em]">
          <span className="text-white">WS</span>
          <span className="text-[#FF7300]">O2</span>
        </span>
      </div>
    );
  }

  if (normalized.includes('hcl')) {
    return (
      <div className={`rounded-full bg-[#005CAB] text-white flex items-center justify-center font-black italic tracking-wider shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="text-[0.8em]">HCL</span>
      </div>
    );
  }

  if (normalized.includes('dialog')) {
    return (
      <div className={`rounded-full bg-[#ED1B24] text-white flex items-center justify-center font-extrabold shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="text-[0.75em]">Dialog</span>
      </div>
    );
  }

  if (normalized.includes('mas')) {
    return (
      <div className={`rounded-full bg-[#1A365D] text-white flex items-center justify-center font-black tracking-widest shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="text-[0.8em]">MAS</span>
      </div>
    );
  }

  if (normalized.includes('lseg') || normalized.includes('london')) {
    return (
      <div className={`rounded-full bg-[#001D48] text-white flex items-center justify-center font-bold tracking-tight shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="text-[0.75em] text-cyan-300">LSEG</span>
      </div>
    );
  }

  if (normalized.includes('ifs')) {
    return (
      <div className={`rounded-full bg-[#581C87] text-white flex items-center justify-center font-black tracking-tighter shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
        <span className="text-[0.8em]">IFS</span>
      </div>
    );
  }

  // Default clean monogram
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0 ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
};
