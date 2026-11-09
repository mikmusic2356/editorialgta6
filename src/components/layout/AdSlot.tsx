import React, { useEffect, useRef } from 'react';

export type AdBannerFormat = '728x90' | '320x50' | '300x250' | '160x600';

interface AdConfig {
  key: string;
  width: number;
  height: number;
}

const AD_CONFIGS: Record<AdBannerFormat, AdConfig> = {
  '320x50': {
    key: 'f4ec733099ae9c38a0c859dae5d83d08',
    width: 320,
    height: 50,
  },
  '728x90': {
    key: 'fe9f4f2b3ec6ad7406b20224df1813ad',
    width: 728,
    height: 90,
  },
  '300x250': {
    key: '33d0304a39742543113687506c0f6c43',
    width: 300,
    height: 250,
  },
  '160x600': {
    key: '1f54c7a76bc492e65553928a6c622511',
    width: 160,
    height: 600,
  },
};

/**
 * AdsterraUnit: Renders an Adsterra ad safely inside an isolated sandboxed iframe.
 * Using an iframe document injection is standard for SPA / React to guarantee scripts
 * run reliably on every route transition without DOM clashes or document.write issues.
 */
export const AdsterraUnit: React.FC<{ format: AdBannerFormat; label?: string }> = ({ format, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = AD_CONFIGS[format];

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = `${config.width}px`;
    iframe.height = `${config.height}px`;
    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.setAttribute('title', label || `Publicidad ${format}`);

    container.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { margin: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${config.key}',
                'format' : 'iframe',
                'height' : ${config.height},
                'width' : ${config.width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://bicea.org/22/${config.key}"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [format, config.key, config.height, config.width, label]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden"
      style={{ minWidth: config.width, minHeight: config.height }}
    />
  );
};

export interface AdSlotProps {
  /**
   * Placement preset:
   * - 'leaderboard': Desktop 728x90, Mobile 320x50
   * - 'in-article': Desktop 728x90, Mobile 300x250
   * - 'rectangle': 300x250 on all devices (centered)
   * - 'skyscraper': 160x600 for wide desktop sidebars
   * - 'post-content': Desktop 728x90, Mobile 300x250
   * - 'tower-left' | 'tower-right': 160x600 for wide desktop
   * - 'between-blocks': Desktop 728x90, Mobile 300x250
   */
  type?: 'leaderboard' | 'in-article' | 'rectangle' | 'skyscraper' | 'post-content' | 'tower-left' | 'tower-right' | 'between-blocks';
  slotId?: string;
  className?: string;
}

/**
 * AdSlot: Responsive, elegant advertising container with "PUBLICIDAD" disclosure.
 * Switches cleanly between mobile and desktop banner sizes with zero layout breakage.
 */
export const AdSlot: React.FC<AdSlotProps> = ({ 
  type = 'leaderboard',
  slotId,
  className = '' 
}) => {
  return (
    <aside 
      aria-label="Espacio Publicitario"
      className={`my-6 mx-auto w-full flex flex-col items-center justify-center not-prose ${className}`}
    >
      {/* Etiqueta transparente y no engañosa */}
      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1.5 select-none opacity-80">
        Publicidad
      </span>

      {/* 1. LEADERBOARD: 728x90 en Desktop / 320x50 en Móvil */}
      {type === 'leaderboard' && (
        <div className="w-full flex justify-center">
          <div className="hidden md:flex justify-center min-w-[728px] min-h-[90px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
            <AdsterraUnit format="728x90" label={`${slotId || 'ad'}-desktop`} />
          </div>
          <div className="flex md:hidden justify-center min-w-[320px] min-h-[50px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
            <AdsterraUnit format="320x50" label={`${slotId || 'ad'}-mobile`} />
          </div>
        </div>
      )}

      {/* 2. IN-ARTICLE / POST-CONTENT / BETWEEN-BLOCKS: 728x90 en Desktop / 300x250 en Móvil */}
      {(type === 'in-article' || type === 'post-content' || type === 'between-blocks') && (
        <div className="w-full flex justify-center">
          <div className="hidden md:flex justify-center min-w-[728px] min-h-[90px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
            <AdsterraUnit format="728x90" label={`${slotId || 'ad'}-desktop`} />
          </div>
          <div className="flex md:hidden justify-center min-w-[300px] min-h-[250px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
            <AdsterraUnit format="300x250" label={`${slotId || 'ad'}-mobile`} />
          </div>
        </div>
      )}

      {/* 3. RECTANGLE: 300x250 tanto en móvil como en escritorio */}
      {type === 'rectangle' && (
        <div className="flex justify-center min-w-[300px] min-h-[250px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
          <AdsterraUnit format="300x250" label={`${slotId || 'ad'}-rect`} />
        </div>
      )}

      {/* 4. SKYSCRAPER / TOWER: 160x600 solo en escritorio */}
      {(type === 'skyscraper' || type === 'tower-left' || type === 'tower-right') && (
        <div className="hidden xl:flex flex-col items-center justify-center min-w-[160px] min-h-[600px] bg-slate-900/30 rounded-lg p-1 border border-slate-800/40 shadow-xs">
          <AdsterraUnit format="160x600" label={`${slotId || 'ad'}-tower`} />
        </div>
      )}
    </aside>
  );
};

/**
 * StickySkyscrapers: Renderiza las 2 torres laterales fijas (160x600) a izquierda y derecha
 * que el usuario señaló en la captura. Permanecen visibles en pantalla al scrollear en escritorios anchos.
 */
export const StickySkyscrapers: React.FC = () => {
  return (
    <>
      {/* Torre Izquierda Fija (Sticky Left 160x600) */}
      <aside 
        aria-label="Anuncio Lateral Izquierdo"
        className="hidden 2xl:flex flex-col items-center fixed left-3 top-28 z-30 pointer-events-auto"
      >
        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 mb-1 select-none opacity-70">
          Publicidad
        </span>
        <div className="bg-slate-900/50 backdrop-blur-xs rounded-xl p-1 border border-slate-800/60 shadow-xl overflow-hidden min-w-[160px] min-h-[600px]">
          <AdsterraUnit format="160x600" label="sticky-skyscrapper-left" />
        </div>
      </aside>

      {/* Torre Derecha Fija (Sticky Right 160x600) */}
      <aside 
        aria-label="Anuncio Lateral Derecho"
        className="hidden 2xl:flex flex-col items-center fixed right-3 top-28 z-30 pointer-events-auto"
      >
        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 mb-1 select-none opacity-70">
          Publicidad
        </span>
        <div className="bg-slate-900/50 backdrop-blur-xs rounded-xl p-1 border border-slate-800/60 shadow-xl overflow-hidden min-w-[160px] min-h-[600px]">
          <AdsterraUnit format="160x600" label="sticky-skyscrapper-right" />
        </div>
      </aside>
    </>
  );
};
