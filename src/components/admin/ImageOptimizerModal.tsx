import React, { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { runFullImageOptimization, OptimizationReport, OptimizationLogEntry } from '../../lib/imageOptimizationService';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  X, 
  Sparkles, 
  HardDrive, 
  TrendingDown, 
  Layers, 
  ArrowRight,
  RefreshCw,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';

interface ImageOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImageOptimizerModal: React.FC<ImageOptimizerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { media, articles, updateArticle, syncWithTurso } = useCMS();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; currentItemName: string }>({
    current: 0,
    total: 0,
    currentItemName: ''
  });
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'converted' | 'already_optimized'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleStartOptimization();
    } else {
      setReport(null);
      setIsAnalyzing(false);
      setAppliedSuccess(false);
    }
  }, [isOpen]);

  const handleStartOptimization = async () => {
    setIsAnalyzing(true);
    setAppliedSuccess(false);
    setReport(null);

    try {
      // Simulate stepped progress for smooth UX
      const result = await runFullImageOptimization(media, articles, (p) => {
        setProgress(p);
      });
      setReport(result);
    } catch (err) {
      console.error('Error during optimization analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!report) return;
    setIsApplying(true);

    try {
      // 1. Update localStorage
      localStorage.setItem('leonida_cms_v5_media', JSON.stringify(report.updatedMedia));
      localStorage.setItem('leonida_cms_v5_articles', JSON.stringify(report.updatedArticles));

      // 2. Sync to Turso DB
      await syncWithTurso();

      setAppliedSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        onClose();
        // Force window reload or re-render if necessary so state refreshes across all tabs
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Error applying optimizations:', err);
      alert('Se guardaron los cambios localmente. Error sincronizando con la nube.');
    } finally {
      setIsApplying(false);
    }
  };

  if (!isOpen) return null;

  const percentProgress = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  const filteredLogs = (report?.logs || []).filter(log => {
    if (filterType === 'converted' && log.status !== 'converted') return false;
    if (filterType === 'already_optimized' && log.status !== 'already_optimized') return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return log.name.toLowerCase().includes(q) || log.originalUrl.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-[#ffc456] flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#ffc456] uppercase font-bold tracking-wider">
                  MOTOR DE RENDERIZADO & COMPRESIÓN WEBP
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
                  v2.0 Core Web Vitals
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display">
                Comprimir Imágenes y Convertir Formato
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Scanning / Analyzing state */}
          {isAnalyzing && (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>

              <div className="space-y-1 max-w-md">
                <h3 className="text-lg font-bold text-white">
                  Escaneando y Renderizando Biblioteca...
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {progress.currentItemName || 'Analizando resoluciones, extensiones y compresión...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Progreso: {progress.current} / {progress.total}</span>
                  <span className="text-orange-400 font-bold">{percentProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-[#ffc456] transition-all duration-150"
                    style={{ width: `${percentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Report Results */}
          {!isAnalyzing && report && (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>Analizadas</span>
                    <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {report.totalAnalyzed}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Biblioteca + Artículos
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 bg-emerald-950/10 space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 text-xs font-mono">
                    <span>Ya Optimizadas</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {report.totalAlreadyOptimized}
                  </div>
                  <div className="text-[10px] text-emerald-500/80">
                    100% formato WebP
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-orange-500/30 bg-orange-950/10 space-y-1">
                  <div className="flex items-center justify-between text-orange-400 text-xs font-mono">
                    <span>Convertidas</span>
                    <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-orange-400">
                    {report.totalConverted}
                  </div>
                  <div className="text-[10px] text-orange-500/80">
                    Migradas a .webp
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-[#ff6486]/30 bg-[#ff6486]/10 space-y-1">
                  <div className="flex items-center justify-between text-[#ff6486] text-xs font-mono">
                    <span>Ahorro Total</span>
                    <TrendingDown className="w-4 h-4 text-[#ff6486]" />
                  </div>
                  <div className="text-2xl font-black text-[#ff6486]">
                    {report.totalSavedMb > 0 ? `${report.totalSavedMb} MB` : `${report.averageSavingsPercent}%`}
                  </div>
                  <div className="text-[10px] text-[#ff6486]/80">
                    Carga ultra veloz
                  </div>
                </div>

              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {report.totalConverted > 0 
                        ? `¡Se detectaron ${report.totalConverted} imágenes listas para actualizar a WebP!` 
                        : '✓ Todas las imágenes de la biblioteca y artículos están 100% optimizadas'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Formato WebP nativo activo para máxima velocidad en computadores y celulares.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartOptimization}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-analizar</span>
                </button>
              </div>

              {/* Detailed Image Audit Log */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono uppercase text-[#ffc456] font-bold">
                    Registro de Análisis por Recurso ({filteredLogs.length})
                  </div>

                  {/* Filter Pills + Search */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          filterType === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setFilterType('converted')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          filterType === 'converted' ? 'bg-orange-500/30 text-orange-300 font-bold' : 'text-slate-400'
                        }`}
                      >
                        Convertidas ({report.totalConverted})
                      </button>
                      <button
                        onClick={() => setFilterType('already_optimized')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          filterType === 'already_optimized' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-slate-400'
                        }`}
                      >
                        Optimizadas ({report.totalAlreadyOptimized})
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-7 pr-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden w-28 sm:w-36 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Log List */}
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 no-scrollbar rounded-xl border border-slate-800/80 bg-slate-950/40 p-2">
                  {filteredLogs.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {item.status === 'converted' ? (
                          <div className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                            <Zap className="w-3.5 h-3.5 fill-orange-400" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {item.message}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <span className="text-[11px] font-bold text-emerald-400">
                          {item.optimizedSizeKb} KB
                        </span>
                        {item.reductionPercentage > 0 && (
                          <span className="ml-2 text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                            -{item.reductionPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            {appliedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ¡Optimizaciones guardadas en Base de Datos y Navegador!
              </span>
            ) : (
              <span>Sincronización instantánea con Turso Cloud DB</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isApplying}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              disabled={isAnalyzing || isApplying || appliedSuccess}
              onClick={handleApplyChanges}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 via-rose-500 to-[#ffc456] hover:opacity-95 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Aplicando y Sincronizando...</span>
                </>
              ) : appliedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Aplicado con Éxito!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Guardar y Aplicar Optimizaciones</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
