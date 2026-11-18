import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MainCategorySlug } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onSelectCategory: (category: MainCategorySlug | 'portada') => void;
  onOpenLegalModal: (tab: 'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer') => void;
  onOpenSEOInspector?: () => void;
  onOpenSitemap?: () => void;
  onOpenAdmin?: () => void;
  onOpenCookieSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenLegalModal,
  onOpenSEOInspector,
  onOpenSitemap,
  onOpenAdmin,
  onOpenCookieSettings,
}) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Editorial Statement */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo
              size="md"
              subtitleText="REVISTA EDITORIAL & ARCHIVO GTA 6"
              onClick={() => onSelectCategory('portada')}
            />
            
            <p className="text-sm text-white/90 leading-relaxed max-w-md font-light">
              Portal editorial digital independiente especializado en la cobertura de <strong className="text-white">Grand Theft Auto VI</strong>, noticias verificadas, guías completas, trucos, manuales balísticos, mapas y archivo de Rockstar Games.
            </p>

            {/* Independent Disclaimer */}
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-300 leading-normal space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff6486]" />
                Aviso de Independencia Editorial
              </div>
              <p className="text-white/80">
                KAIROSION es una publicación periodística independiente. Grand Theft Auto, GTA VI, Vice City y Rockstar Games son marcas registradas de Take-Two Interactive Software, Inc. Este sitio no está patrocinado ni afiliado oficialmente a Rockstar Games.
              </p>
            </div>
          </div>

          {/* Column 2: Grandes Áreas Editoriales */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-[#ff6486] uppercase font-bold">
              Áreas Editoriales
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { slug: 'gta-6' as const, label: 'GTA 6 Hub General', href: '/gta-6' },
                { slug: 'noticias' as const, label: 'Noticias de última hora', href: '/gta-6/noticias' },
                { slug: 'guias' as const, label: 'Guías y Walkthroughs', href: '/gta-6/guias' },
                { slug: 'trucos-consejos' as const, label: 'Trucos y Consejos', href: '/gta-6/trucos-consejos' },
                { slug: 'rockstar-games' as const, label: 'Rockstar Games & Take-Two', href: '/gta-6/rockstar-games' },
              ].map((item) => (
                <li key={item.slug}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(item.slug);
                    }}
                    className="hover:text-[#ffc456] transition-colors flex items-center gap-1 cursor-pointer text-white/90"
                  >
                    <ChevronRight className="w-3 h-3 text-[#ff6486]" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Enciclopedia de Leonida */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-[#ff6486] uppercase font-bold">
              Enciclopedia
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { slug: 'personajes' as const, label: 'Expedientes de Personajes', href: '/gta-6/personajes' },
                { slug: 'mapa' as const, label: 'Mapa de Leonida & Distritos', href: '/gta-6/mapa' },
                { slug: 'vehiculos' as const, label: 'Catálogo de Vehículos', href: '/gta-6/vehiculos' },
                { slug: 'armas' as const, label: 'Arsenal & Balística', href: '/gta-6/armas' },
                { slug: 'musica' as const, label: 'Música & Emisoras de Radio', href: '/gta-6/musica' },
              ].map((item) => (
                <li key={item.slug}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(item.slug);
                    }}
                    className="hover:text-[#ffc456] transition-colors flex items-center gap-1 cursor-pointer text-white/90"
                  >
                    <ChevronRight className="w-3 h-3 text-[#ff6486]" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal, SEO & Search Console */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-[#ff6486] uppercase font-bold">
              Transparencia & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { tab: 'about' as const, label: 'Sobre Nosotros (KAIROSION)', href: '/pagina/sobre-nosotros' },
                { tab: 'contact' as const, label: 'Contacto editorial', href: '/pagina/contacto' },
                { tab: 'disclaimer' as const, label: 'Aviso legal y descargo', href: '/pagina/aviso-legal-y-descargo' },
                { tab: 'privacy' as const, label: 'Política de privacidad', href: '/pagina/politica-de-privacidad' },
                { tab: 'cookies' as const, label: 'Política de cookies', href: '/pagina/politica-de-cookies' },
                { tab: 'terms' as const, label: 'Términos y condiciones', href: '/pagina/terminos-y-condiciones' },
              ].map((item) => (
                <li key={item.tab}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenLegalModal(item.tab);
                    }}
                    className="hover:text-[#ffc456] transition-colors cursor-pointer text-white/90 text-xs block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 flex flex-col gap-2">
                {onOpenCookieSettings && (
                  <a
                    href="/pagina/politica-de-cookies"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenCookieSettings();
                    }}
                    className="text-xs font-mono text-[#ffc456] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configuración de Cookies</span>
                  </a>
                )}

                <a
                  href="/sitemap"
                  onClick={(e) => {
                    if (onOpenSitemap) {
                      e.preventDefault();
                      onOpenSitemap();
                    }
                  }}
                  className="text-xs font-mono text-[#ffc456] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ff6486]" />
                  <span>Mapa del Sitio Web (/sitemap)</span>
                </a>

                {onOpenSEOInspector && (
                  <button
                    onClick={onOpenSEOInspector}
                    className="text-xs font-mono text-[#ffc456] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Sitemap XML & Schema</span>
                  </button>
                )}

                {onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="text-xs font-mono font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer w-fit shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Panel de Redacción CMS</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-white">KAIROSION</strong> · Portal Editorial Especializado en GTA 6.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/80">Arquitectura Editorial Escalable</span>
            <span>·</span>
            <span className="font-mono text-[#ffc456]">Core Web Vitals Optimizado</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
