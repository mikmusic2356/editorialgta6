import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  itemLabel?: string; // e.g. "artículos", "publicaciones", "resultados"
  className?: string;
  showDetails?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [6, 12, 24],
  itemLabel = 'artículos',
  className = '',
  showDetails = true
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = (): (number | 'ellipsis-prev' | 'ellipsis-next')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis-prev' | 'ellipsis-next')[] = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis-next');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('ellipsis-prev');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis-prev');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('ellipsis-next');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    // Smooth scroll to top of list container if needed
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      
      {/* Information text & Per-page selector */}
      {showDetails && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span>
            Mostrando <strong className="text-white font-bold">{startItem}</strong> - <strong className="text-white font-bold">{endItem}</strong> de <strong className="text-[#ffc456] font-bold">{totalItems}</strong> {itemLabel}
          </span>

          {onItemsPerPageChange && itemsPerPageOptions && itemsPerPageOptions.length > 1 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-400">Por pág:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  onItemsPerPageChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-md text-[11px] text-white focus:outline-hidden focus:border-[#ff6486] cursor-pointer font-mono"
              >
                {itemsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Navegación de páginas" className="flex items-center gap-1 select-none">
          {/* First Page */}
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            aria-label="Ir a la primera página"
            title="Primera página"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Ir a la página anterior"
            title="Página anterior"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((item, idx) => {
              if (item === 'ellipsis-prev' || item === 'ellipsis-next') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs font-mono text-slate-600"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = item === currentPage;

              return (
                <button
                  key={item}
                  onClick={() => handlePageClick(item)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#ff6486] text-white shadow-sm shadow-[#ff6486]/30 border border-[#ff6486]'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Ir a la página siguiente"
            title="Página siguiente"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Ir a la última página"
            title="Última página"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}

    </div>
  );
};
