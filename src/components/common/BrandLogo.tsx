import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showBadge = true,
  showSubtitle = true,
  subtitleText = 'PORTAL EDITORIAL GTA 6',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: {
      badge: 'w-6 h-6 text-xs',
      brand: 'text-base sm:text-lg',
      sub: 'text-[7px]'
    },
    md: {
      badge: 'w-8 h-8 text-sm',
      brand: 'text-xl sm:text-2xl',
      sub: 'text-[9px]'
    },
    lg: {
      badge: 'w-10 h-10 text-base',
      brand: 'text-2xl sm:text-3xl',
      sub: 'text-[10px]'
    },
    xl: {
      badge: 'w-12 h-12 text-lg',
      brand: 'text-3xl sm:text-4xl',
      sub: 'text-xs'
    }
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {showBadge && (
        <div className={`${sizeClasses.badge} rounded-lg bg-gradient-to-tr from-[#ff6486] to-[#ffc456] flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-105 transition-transform shrink-0`}>
          VI
        </div>
      )}
      <div className="flex flex-col text-left">
        <div className={`${sizeClasses.brand} font-extrabold tracking-tight font-display uppercase leading-none select-none flex items-center`}>
          {/* KAIROS in pure crisp white */}
          <span className="text-white drop-shadow-xs group-hover:text-slate-100 transition-colors">
            KAIROS
          </span>
          {/* ION in secondary color #ff6486 */}
          <span className="text-[#ff6486] font-black tracking-wider ml-0.5 drop-shadow-sm">
            ION
          </span>
        </div>
        {showSubtitle && (
          <span className={`${sizeClasses.sub} font-mono tracking-widest text-[#ffc456] uppercase font-bold mt-0.5`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button 
        type="button" 
        onClick={onClick} 
        className="group text-left focus:outline-hidden cursor-pointer shrink-0"
        aria-label="Ir a la portada de KAIROSION"
      >
        {content}
      </button>
    );
  }

  return content;
};
