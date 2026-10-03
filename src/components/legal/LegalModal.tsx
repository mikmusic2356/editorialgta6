import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Send, 
  Info, 
  Globe, 
  Sparkles, 
  Lock, 
  Cookie, 
  Scale, 
  HeartHandshake,
  DollarSign,
  Layers,
  Check
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'about',
}) => {
  const { staticPages } = useCMS();
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy' | 'cookies' | 'terms' | 'disclaimer'>(defaultTab);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  if (!isOpen) return null;

  // Find page by slug from CMS context
  const getPageBySlug = (slug: string) => {
    return staticPages.find(p => p.slug === slug);
  };

  const aboutPage = getPageBySlug('sobre-nosotros');
  const contactPage = getPageBySlug('contacto');
  const privacyPage = getPageBySlug('politica-de-privacidad');
  const cookiesPage = getPageBySlug('politica-de-cookies');
  const termsPage = getPageBySlug('terminos-y-condiciones');
  const disclaimerPage = getPageBySlug('aviso-legal-y-descargo');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onClose();
    }, 2500);
  };

  const renderSimpleMarkdown = (text: string) => {
    return text.split('\n\n').map((block, idx) => {
      if (block.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-white font-display mt-5 mb-2 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffc456]" />
            <span>{block.replace('## ', '')}</span>
          </h3>
        );
      }
      if (block.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-[#ffc456] font-display mt-4 mb-1">
            {block.replace('### ', '')}
          </h4>
        );
      }
      if (block.startsWith('---')) {
        return <hr key={idx} className="my-4 border-slate-800" />;
      }
      if (block.startsWith('* ') || block.startsWith('- ') || block.startsWith('1. ')) {
        const items = block.split('\n');
        return (
          <ul key={idx} className="space-y-1.5 my-3 pl-4 border-l-2 border-[#ff6486]/40">
            {items.map((it, i) => (
              <li key={i} className="text-slate-300 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-[#ff6486] font-bold mt-0.5">•</span>
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: it
                      .replace(/^(\*|-|\d+\.)\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-slate-200">$1</em>')
                  }} 
                />
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p 
          key={idx} 
          className="text-slate-300 text-xs sm:text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: block
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="text-slate-200">$1</em>')
          }}
        />
      );
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ff6486]/20 text-[#ff6486] border border-[#ff6486]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-display text-base sm:text-lg font-bold flex items-center gap-2">
                <span>KAIROSION Editorial & Legal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#ffc456] uppercase">
                  GTA 6 Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparencia periodística, política editorial, modelo de sostenibilidad y derechos de autor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-4 gap-1 text-xs font-medium overflow-x-auto no-scrollbar">
          {[
            { id: 'about', label: 'Sobre Nosotros', icon: Globe },
            { id: 'contact', label: 'Contacto', icon: Mail },
            { id: 'disclaimer', label: 'Aviso Legal y Descargo', icon: Info },
            { id: 'privacy', label: 'Privacidad (RGPD)', icon: Lock },
            { id: 'cookies', label: 'Cookies & AdSense', icon: Cookie },
            { id: 'terms', label: 'Términos de Uso', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 text-xs ${
                  activeTab === tab.id
                    ? 'border-[#ff6486] text-white font-bold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-[#ff6486]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-300 text-sm leading-relaxed">
          
          {/* 1. SOBRE NOSOTROS */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              {/* Highlight Pillars Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="p-2 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-[#ff6486]/20 text-[#ff6486] flex items-center justify-center mx-auto mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white uppercase font-display">Investigación GTA 6</div>
                  <div className="text-[11px] text-slate-400">Noticias y análisis técnico verificados de Leonida</div>
                </div>

                <div className="p-2 space-y-1 border-y sm:border-y-0 sm:border-x border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white uppercase font-display">100% Gratuito</div>
                  <div className="text-[11px] text-slate-400">Sin suscripciones, sin muros de pago ni donaciones</div>
                </div>

                <div className="p-2 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white uppercase font-display">Google AdSense</div>
                  <div className="text-[11px] text-slate-400">Sostenibilidad mediante anuncios no invasivos</div>
                </div>
              </div>

              {aboutPage?.content ? (
                <div className="space-y-4">
                  {renderSimpleMarkdown(aboutPage.content)}
                </div>
              ) : null}
            </div>
          )}

          {/* 2. CONTACTO */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-display">Contacto con la Redacción de KAIROSION</h3>
                <p className="text-xs text-slate-400">
                  ¿Tienes alguna pista informativa sobre GTA 6, sugerencia de guía o propuesta de colaboración editorial? Escríbenos directamente:
                </p>
              </div>

              {sent ? (
                <div className="p-6 text-center rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-base">¡Mensaje enviado a la Redacción!</div>
                  <div className="text-xs text-emerald-300">
                    Agradecemos tu mensaje. Nuestro equipo editorial lo revisará a la brevedad.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Nombre o Alias</label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-[#ff6486] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-[#ff6486] focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Asunto</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Corrección de datos de vehículo / Propuesta de guía"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-[#ff6486] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Mensaje Detallado</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe tu consulta o aporte informativo..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-[#ff6486] focus:outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Mensaje a KAIROSION</span>
                    </button>
                  </div>
                </form>
              )}

              {contactPage?.content && (
                <div className="pt-4 border-t border-slate-800 text-xs">
                  {renderSimpleMarkdown(contactPage.content)}
                </div>
              )}
            </div>
          )}

          {/* 3. AVISO LEGAL Y DESCARGO */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 text-sm">
                  <Info className="w-4 h-4" />
                  <span>Declaración de Independencia y Marcas Registradas</span>
                </div>
                <p>
                  <strong>KAIROSION</strong> es un medio de comunicación y divulgación independiente producido por entusiastas y periodistas del sector de los videojuegos sin fines de representación corporativa oficial.
                </p>
                <p>
                  Grand Theft Auto, GTA VI, GTA 6, Vice City, Leonida, Rockstar Games y Take-Two Interactive son marcas registradas de Take-Two Interactive Software, Inc. Su mención y la inclusión de capturas de vídeo en esta web responden al derecho de cita y uso periodístico legítimo (*Fair Use*).
                </p>
              </div>

              {disclaimerPage?.content && (
                <div className="space-y-3">
                  {renderSimpleMarkdown(disclaimerPage.content)}
                </div>
              )}
            </div>
          )}

          {/* 4. PRIVACIDAD (RGPD) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">Política de Privacidad y Tratamiento de Datos (RGPD)</h3>
              {privacyPage?.content ? (
                <div className="space-y-3">
                  {renderSimpleMarkdown(privacyPage.content)}
                </div>
              ) : null}
            </div>
          )}

          {/* 5. COOKIES & ADSENSE */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">Política de Cookies & Publicidad de Google AdSense</h3>
              {cookiesPage?.content ? (
                <div className="space-y-3">
                  {renderSimpleMarkdown(cookiesPage.content)}
                </div>
              ) : null}
            </div>
          )}

          {/* 6. TERMINOS Y CONDICIONES */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">Términos y Condiciones de Uso</h3>
              {termsPage?.content ? (
                <div className="space-y-3">
                  {renderSimpleMarkdown(termsPage.content)}
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>KAIROSION · Información libre y abierta</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
