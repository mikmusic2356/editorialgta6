import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { AIProposal } from '../../types/cms';
import { MainCategorySlug } from '../../types';
import { AdminSection } from './AdminLayout';
import { 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RefreshCw,
  Eye
} from 'lucide-react';

interface AdminAIAssistantProps {
  onNavigate: (section: AdminSection, articleId?: string) => void;
}

export const AdminAIAssistant: React.FC<AdminAIAssistantProps> = ({ onNavigate }) => {
  const { 
    aiProposals, 
    generateAIDraftProposal, 
    acceptAIProposal, 
    rejectAIProposal,
    categories 
  } = useCMS();

  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MainCategorySlug>('noticias');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const filteredProposals = aiProposals.filter(p => p.status === activeTab);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Por favor, describe el tema o la noticia para generar la propuesta.');
      return;
    }

    setIsGenerating(true);
    try {
      await generateAIDraftProposal(prompt, selectedCategory);
      setPrompt('');
      setActiveTab('pending');
      alert('¡Nueva propuesta generada con éxito! Está en cola para tu revisión.');
    } catch (e) {
      console.error(e);
      alert('Hubo un problema al generar la propuesta.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = (proposalId: string) => {
    const createdArticle = acceptAIProposal(proposalId);
    if (createdArticle) {
      if (confirm('Propuesta aceptada y convertida en borrador en revisión. ¿Deseas abrir el editor ahora?')) {
        onNavigate('edit-article', createdArticle.id);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>MOTOR DE ASISTENCIA EDITORIAL & FACT-CHECKING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Redacción Asistida por IA (Human-in-the-Loop)
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl font-light leading-relaxed">
          Diseñado bajo el principio de <strong>calidad y control editorial</strong>: la IA genera sugerencias estructuradas, pero nunca publica directamente en producción. Cada propuesta debe ser revisada, editada y aprobada por un editor humano.
        </p>
      </div>

      {/* 1. DRAFT GENERATOR INTERFACE */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-purple-300 font-bold">
          Solicitar Nuevo Borrador o Desglose Analítico
        </h3>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Analizar las patentes de animaciones dinámicas registradas por Take-Two para la interacción entre Lucia y Jason en espacios confinados..."
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-400 leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Categoría destino:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MainCategorySlug)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generando propuesta...' : 'Generar Propuesta con IA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROPOSALS MODERATION QUEUE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'pending' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pendientes de Revisión ({aiProposals.filter(p => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'accepted' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aceptadas ({aiProposals.filter(p => p.status === 'accepted').length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'rejected' ? 'bg-red-900 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Descartadas ({aiProposals.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>

        {filteredProposals.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
            No hay propuestas en esta sección.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((prop) => (
              <div
                key={prop.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-950 border border-purple-500/40 text-purple-300">
                      {prop.type === 'new_draft' ? 'NUEVO BORRADOR SUGERIDO' : 'PROPUESTA DE ACTUALIZACIÓN'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(prop.createdAt).toLocaleString('es-ES')}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Modelo: {prop.aiModel}
                  </span>
                </div>

                {prop.targetArticleTitle && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-rose-400">Artículo destino a actualizar: </span>
                    <span>{prop.targetArticleTitle}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {prop.excerpt}
                  </p>
                </div>

                {prop.changeSummary && (
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                    <strong>Resumen de cambios propuestos:</strong> {prop.changeSummary}
                  </div>
                )}

                {/* Proposed Content Preview Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {prop.proposedContent}
                </div>

                {/* Actions */}
                {prop.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => rejectAIProposal(prop.id)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      Descartar Propuesta
                    </button>
                    <button
                      onClick={() => handleAccept(prop.id)}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aceptar & Convertir en Borrador</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
