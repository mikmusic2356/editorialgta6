import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCMS } from '../../context/CMSContext';
import { CMSArticle, MediaItem } from '../../types/cms';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading2, 
  Heading3, 
  Pilcrow, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Link as LinkIcon, 
  Unlink, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Minus, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Undo, 
  Redo, 
  Code, 
  Sparkles, 
  Search, 
  ExternalLink, 
  X, 
  ChevronRight, 
  Trash2, 
  Check, 
  Eye, 
  Flame, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  onOpenMediaLibrary?: () => void;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe aquí el contenido enriquecido del artículo o sección...',
  minHeight = '360px',
  label
}) => {
  const { articles, media } = useCMS();
  const editorRef = useRef<HTMLDivElement>(null);
  
  // View mode: visual WYSIWYG or source HTML
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);

  // Selection state & floating action bar
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Link Modals
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkTab, setLinkTab] = useState<'internal' | 'external'>('internal');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [linkDisplayText, setLinkDisplayText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  // Active Link Inspector Popover
  const [activeLinkElement, setActiveLinkElement] = useState<HTMLAnchorElement | null>(null);
  const [linkInspectorPos, setLinkInspectorPos] = useState<{ top: number; left: number } | null>(null);

  // Insert Custom Table Modal
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  // Insert Image Modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'library' | 'url'>('library');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right' | 'full'>('center');

  // Insert Callout Box Modal
  const [calloutModalOpen, setCalloutModalOpen] = useState(false);
  const [calloutType, setCalloutType] = useState<'info' | 'warning' | 'tip' | 'rockstar-note'>('info');
  const [calloutTitle, setCalloutTitle] = useState('Información Táctica de Leonida');
  const [calloutContent, setCalloutContent] = useState('');

  // Opportunities Sidebar Panel
  const [showOpportunities, setShowOpportunities] = useState(true);
  const [ignoredOpportunities, setIgnoredOpportunities] = useState<string[]>([]);

  // Sync internal HTML with external value
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setRawHtml(value || '');
  }, [value, isHtmlMode]);

  // Clean HTML sanitizer for paste & export
  const cleanHtmlString = (dirty: string): string => {
    // Basic parser & cleanup of dirty Word / Web tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dirty;

    // Remove scripts, styles, objects, meta, link tags
    const badTags = tempDiv.querySelectorAll('script, style, meta, link, object, embed, iframe:not([src*="youtube"])');
    badTags.forEach(el => el.remove());

    // Clean inline Microsoft Word styles
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove mso- attributes and inline styles that break Tailwind
      el.removeAttribute('class');
      const styleAttr = el.getAttribute('style');
      if (styleAttr && (styleAttr.includes('mso-') || styleAttr.includes('font-family'))) {
        el.removeAttribute('style');
      }
    });

    return tempDiv.innerHTML;
  };

  // Emit changes to parent
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const cleaned = cleanHtmlString(html);
      onChange(cleaned);
      setRawHtml(cleaned);
    }
  }, [onChange]);

  // Execute formatting command with execCommand or direct DOM manipulation
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentChange();
  };

  // Apply block format (h2, h3, p, blockquote)
  const applyBlockFormat = (tag: string) => {
    if (isHtmlMode) return;
    document.execCommand('formatBlock', false, `<${tag}>`);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentChange();
  };

  // Handle Selection change for floating actions & link detection
  const handleSelectionOrClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      setFloatingMenuPos(null);
      setActiveLinkElement(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    // Check if selection is inside our editor
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      setFloatingMenuPos(null);
      setActiveLinkElement(null);
      return;
    }

    // Check if clicked element is an <a> tag
    let anchor: HTMLAnchorElement | null = null;
    let node: Node | null = range.startContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'A') {
        anchor = node as HTMLAnchorElement;
        break;
      }
      node = node.parentNode;
    }

    if (anchor) {
      setActiveLinkElement(anchor);
      const rect = anchor.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setLinkInspectorPos({
        top: rect.bottom - editorRect.top + 8,
        left: Math.max(10, rect.left - editorRect.left)
      });
      setFloatingMenuPos(null);
    } else {
      setActiveLinkElement(null);
    }

    if (text.length > 0 && !anchor) {
      setSelectedRange(range.cloneRange());
      setSelectedText(text);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setFloatingMenuPos({
        top: rect.top - editorRect.top - 42,
        left: Math.max(10, rect.left - editorRect.left + (rect.width / 2) - 100)
      });
    } else if (!anchor) {
      setFloatingMenuPos(null);
    }
  };

  // Open internal link connector modal
  const openInternalLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelectedRange(range.cloneRange());
      const text = selection.toString().trim();
      setSelectedText(text);
      setLinkDisplayText(text);
      setArticleSearchQuery(text);
    }
    setLinkTab('internal');
    setLinkModalOpen(true);
    setFloatingMenuPos(null);
  };

  // Open external link modal
  const openExternalLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelectedRange(range.cloneRange());
      const text = selection.toString().trim();
      setSelectedText(text);
      setLinkDisplayText(text);
    }
    setExternalUrl('https://');
    setLinkTab('external');
    setLinkModalOpen(true);
    setFloatingMenuPos(null);
  };

  // Insert Internal Link to an Article
  const insertInternalArticleLink = (targetArticle: CMSArticle) => {
    if (!selectedRange && !editorRef.current) return;

    const selection = window.getSelection();
    if (selection && selectedRange) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }

    const textToDisplay = linkDisplayText.trim() || selectedText || targetArticle.title;
    const internalUrl = `/articulo/${targetArticle.slug}`;

    const linkHtml = `<a href="${internalUrl}" data-internal-article="${targetArticle.slug}" title="${targetArticle.title}" class="text-rose-400 font-semibold underline decoration-rose-500/50 hover:text-rose-300 transition-colors">${textToDisplay}</a>`;
    
    document.execCommand('insertHTML', false, linkHtml);
    setLinkModalOpen(false);
    setSelectedRange(null);
    setSelectedText('');
    handleContentChange();
  };

  // Insert External Link
  const insertExternalLink = () => {
    if (!selectedRange && !editorRef.current) return;

    const selection = window.getSelection();
    if (selection && selectedRange) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }

    const textToDisplay = linkDisplayText.trim() || selectedText || externalUrl;
    const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

    const linkHtml = `<a href="${externalUrl}"${targetAttr} class="text-cyan-400 font-medium underline decoration-cyan-500/40 hover:text-cyan-300 transition-colors">${textToDisplay}</a>`;
    
    document.execCommand('insertHTML', false, linkHtml);
    setLinkModalOpen(false);
    setSelectedRange(null);
    setSelectedText('');
    handleContentChange();
  };

  // Remove existing link
  const handleRemoveExistingLink = () => {
    if (!activeLinkElement) return;
    const parent = activeLinkElement.parentNode;
    if (parent) {
      while (activeLinkElement.firstChild) {
        parent.insertBefore(activeLinkElement.firstChild, activeLinkElement);
      }
      parent.removeChild(activeLinkElement);
      setActiveLinkElement(null);
      handleContentChange();
    }
  };

  // Insert Table
  const handleInsertTable = () => {
    let tableHtml = `<div class="my-6 overflow-x-auto not-prose"><table class="w-full text-left border-collapse rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 text-xs">`;
    
    if (tableHasHeader) {
      tableHtml += `<thead class="bg-slate-950/80 text-rose-400 font-mono border-b border-slate-800"><tr>`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<th class="p-3 font-bold uppercase">Columna ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    for (let r = 1; r <= tableRows; r++) {
      const bgClass = r % 2 === 0 ? 'bg-slate-950/40' : 'bg-transparent';
      tableHtml += `<tr class="border-b border-slate-800/60 ${bgClass}">`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<td class="p-3 text-slate-300">Dato ${r}.${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    executeCommand('insertHTML', tableHtml);
    setTableModalOpen(false);
  };

  // Insert Image into content
  const handleInsertImage = () => {
    if (!imageUrl) return;

    let alignClass = 'w-full my-6';
    if (imageAlign === 'left') alignClass = 'float-left mr-6 mb-4 max-w-sm w-full';
    if (imageAlign === 'right') alignClass = 'float-right ml-6 mb-4 max-w-sm w-full';
    if (imageAlign === 'center') alignClass = 'mx-auto max-w-2xl my-6 block';

    const figureHtml = `
      <figure class="${alignClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-1.5 shadow-xl not-prose clear-both">
        <img src="${imageUrl}" alt="${imageAlt || 'Imagen editorial GTA 6'}" class="w-full h-auto rounded-xl object-cover" />
        ${imageCaption ? `<figcaption class="text-[11px] text-center text-slate-400 font-mono py-2 px-3 border-t border-slate-900 mt-1">${imageCaption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;

    executeCommand('insertHTML', figureHtml);
    setImageModalOpen(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
  };

  // Insert Callout Box
  const handleInsertCallout = () => {
    const config = {
      info: {
        bg: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200',
        icon: 'ℹ️',
        label: 'Aviso Editorial de Leonida'
      },
      warning: {
        bg: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
        icon: '⚠️',
        label: 'Advertencia Táctica'
      },
      tip: {
        bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200',
        icon: '💡',
        label: 'Truco & Estrategia'
      },
      'rockstar-note': {
        bg: 'bg-rose-950/40 border-rose-500/30 text-rose-200',
        icon: '★',
        label: 'Nota Oficial Rockstar Games'
      }
    }[calloutType];

    const calloutHtml = `
      <div class="my-6 p-4 sm:p-5 rounded-2xl border ${config.bg} space-y-2 not-prose shadow-lg">
        <div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
          <span>${config.icon}</span>
          <span>${calloutTitle || config.label}</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          ${calloutContent || 'Escribe aquí los detalles destacados de esta caja informativa...'}
        </div>
      </div>
      <p><br></p>
    `;

    executeCommand('insertHTML', calloutHtml);
    setCalloutModalOpen(false);
    setCalloutContent('');
  };

  // Helper to safely escape special characters for regular expressions
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Scan text for Automatic Internal Linking Opportunities
  const scanLinkingOpportunities = () => {
    if (!value) return [];
    
    try {
      // Key entities to search for
      const keywords = [
        { term: 'Lucia', targetSlug: 'lucia-historia-habilidades-gta-6', title: 'Lucia: Historia, Habilidades y Rol en GTA 6' },
        { term: 'Jason', targetSlug: 'jason-historia-perfil-gta-6', title: 'Jason: Perfil, Pasado Militar y Habilidades' },
        { term: 'Vice City', targetSlug: 'mapa-completo-vice-city-leonida-gta-6', title: 'Mapa Completo de Leonida: Vice City y Distritos' },
        { term: 'Rockstar Games', targetSlug: 'patentes-take-two-rockstar-animacion-gta-6', title: 'Patentes de Rockstar: Físicas y Animaciones' },
        { term: 'armas', targetSlug: 'guia-armamento-arsenal-leonida-gta-6', title: 'Arsenal Balístico y Personalización de Armas' },
        { term: 'vehículos', targetSlug: 'catalogo-vehiculos-superdeportivos-gta-6', title: 'Catálogo de Vehículos y Conducción en GTA 6' },
        { term: 'Take-Two', targetSlug: 'patentes-take-two-rockstar-animacion-gta-6', title: 'Take-Two & Rockstar Games' },
        { term: 'Grassrivers', targetSlug: 'mapa-completo-vice-city-leonida-gta-6', title: 'Distritos de Leonida y Pantanos Grassrivers' },
        { term: 'Port Gellhorn', targetSlug: 'mapa-completo-vice-city-leonida-gta-6', title: 'Port Gellhorn y Zonas Portuarias' }
      ];

      // Add published article titles as potential matching terms (filtered for clean alphanumeric phrases)
      articles.forEach(art => {
        if (art.title && art.title.length > 5 && !keywords.some(k => k.targetSlug === art.slug)) {
          const cleanTerm = art.title.replace(/[^\w\sáéíóúÁÉÍÓÚñÑüÜ]/g, ' ').trim().slice(0, 30);
          if (cleanTerm.length >= 4) {
            keywords.push({
              term: cleanTerm,
              targetSlug: art.slug,
              title: art.title
            });
          }
        }
      });

      const plainText = value.replace(/<[^>]+>/g, ' ');
      const detected: { term: string; targetSlug: string; title: string; article?: CMSArticle }[] = [];

      keywords.forEach(kw => {
        if (!kw.term || ignoredOpportunities.includes(kw.term)) return;
        
        try {
          const safeTerm = escapeRegExp(kw.term);
          // Check if term exists in text
          const regex = new RegExp(`\\b${safeTerm}\\b`, 'i');
          if (regex.test(plainText)) {
            // Check if it's already inside an <a> tag
            const linkRegex = new RegExp(`<a[^>]*>(?:(?!<\\/a>).)*?${safeTerm}.*?<\\/a>`, 'i');
            if (!linkRegex.test(value)) {
              const matchArticle = articles.find(a => a.slug === kw.targetSlug);
              detected.push({
                ...kw,
                article: matchArticle
              });
            }
          }
        } catch {
          // Ignore any malformed keyword regex
        }
      });

      return detected.slice(0, 5);
    } catch {
      return [];
    }
  };

  const detectedOpportunities = scanLinkingOpportunities();

  // Apply automatic opportunity
  const applyOpportunity = (opp: { term: string; targetSlug: string; title: string }) => {
    if (!editorRef.current || !opp.term) return;
    const html = editorRef.current.innerHTML;

    try {
      const safeTerm = escapeRegExp(opp.term);
      const targetUrl = `/articulo/${opp.targetSlug}`;
      const replacement = `<a href="${targetUrl}" data-internal-article="${opp.targetSlug}" title="${opp.title}" class="text-rose-400 font-semibold underline decoration-rose-500/50 hover:text-rose-300 transition-colors">${opp.term}</a>`;
      
      // Replace only first unlinked occurrence
      const regex = new RegExp(`(?<!<[^>]*)\\b(${safeTerm})\\b(?![^<]*>)`, 'i');
      const newHtml = html.replace(regex, replacement);

      if (newHtml !== html) {
        editorRef.current.innerHTML = newHtml;
        handleContentChange();
      }
    } catch {
      // Fallback ignore
    }
  };

  // Word count & metrics calculation
  const getMetrics = () => {
    const text = (rawHtml || '').replace(/<[^>]+>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime };
  };

  const metrics = getMetrics();

  // Filtered internal articles for search
  const filteredArticles = articles.filter(a => {
    if (!articleSearchQuery) return true;
    const q = articleSearchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-3 font-sans relative">
      
      {/* Editor Top Bar & Toolbar */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 space-y-2 shadow-md">
        
        {/* Row 1: Formatting Tools */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
          
          {/* Left: Text style actions */}
          <div className="flex flex-wrap items-center gap-1">
            
            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Deshacer (⌘Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Rehacer (⌘⇧Z)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Paragraph / Heading Select */}
            <button
              type="button"
              onClick={() => applyBlockFormat('p')}
              className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Párrafo normal"
            >
              <Pilcrow className="w-3 h-3 text-slate-400" />
              <span>P</span>
            </button>
            <button
              type="button"
              onClick={() => applyBlockFormat('h2')}
              className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold font-display flex items-center gap-1 cursor-pointer"
              title="Encabezado H2"
            >
              <Heading2 className="w-3.5 h-3.5 text-rose-400" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => applyBlockFormat('h3')}
              className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold font-display flex items-center gap-1 cursor-pointer"
              title="Encabezado H3"
            >
              <Heading3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>H3</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Bold, Italic, Underline, Strike */}
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Negrita (⌘B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Cursiva (⌘I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Subrayado (⌘U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Tachado"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Lists & Quotes */}
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Lista con viñetas"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Lista numerada"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyBlockFormat('blockquote')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Cita editorial / Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Alignments */}
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Alinear a la izquierda"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Centrar"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Alinear a la derecha"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyFull')}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs cursor-pointer"
              title="Justificar"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Right: HTML toggle & Opportunites Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowOpportunities(!showOpportunities)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showOpportunities 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Mostrar u ocultar sugerencias de enlazado interno"
            >
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Enlazado ({detectedOpportunities.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isHtmlMode) {
                  // Switch to Visual mode
                  if (editorRef.current) {
                    editorRef.current.innerHTML = rawHtml;
                  }
                  onChange(rawHtml);
                }
                setIsHtmlMode(!isHtmlMode);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                isHtmlMode ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Alternar entre editor visual y código HTML limpio"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{isHtmlMode ? 'Visual' : 'HTML'}</span>
            </button>
          </div>

        </div>

        {/* Row 2: Rich Inserts & Internal Linking Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          
          <div className="flex flex-wrap items-center gap-1.5">
            
            {/* Primary Action: Connect Internal Article */}
            <button
              type="button"
              onClick={openInternalLinkModal}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Conectar Artículo Interno</span>
            </button>

            {/* External Link */}
            <button
              type="button"
              onClick={openExternalLinkModal}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Enlace Externo</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Insert Image */}
            <button
              type="button"
              onClick={() => setImageModalOpen(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              <span>Insertar Imagen</span>
            </button>

            {/* Insert Table */}
            <button
              type="button"
              onClick={() => setTableModalOpen(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <TableIcon className="w-3 h-3 text-blue-400" />
              <span>Tabla</span>
            </button>

            {/* Insert Callout Box */}
            <button
              type="button"
              onClick={() => setCalloutModalOpen(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Caja Informativa</span>
            </button>

            {/* Divider */}
            <button
              type="button"
              onClick={() => executeCommand('insertHorizontalRule')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Línea divisoria"
            >
              <Minus className="w-3 h-3" />
              <span>Separador</span>
            </button>

          </div>

          {/* Word & Reading Metrics */}
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span><strong>{metrics.words}</strong> palabras</span>
            <span>·</span>
            <span><strong>~{metrics.readingTime}</strong> min lectura</span>
          </div>

        </div>

      </div>

      {/* Editor Body Grid: Main Content + Optional Opportunities Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Main Content Area */}
        <div className={`space-y-2 relative transition-all ${showOpportunities && detectedOpportunities.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          
          {label && (
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              {label}
            </div>
          )}

          {/* Visual Mode contentEditable container */}
          {!isHtmlMode ? (
            <div className="relative">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                onSelect={handleSelectionOrClick}
                onClick={handleSelectionOrClick}
                onKeyUp={handleSelectionOrClick}
                onPaste={(e) => {
                  e.preventDefault();
                  const html = e.clipboardData.getData('text/html');
                  const text = e.clipboardData.getData('text/plain');
                  if (html) {
                    const cleaned = cleanHtmlString(html);
                    document.execCommand('insertHTML', false, cleaned);
                  } else {
                    document.execCommand('insertText', false, text);
                  }
                  handleContentChange();
                }}
                className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm leading-relaxed focus:outline-hidden focus:border-rose-400/80 prose prose-invert max-w-none shadow-inner"
                style={{ minHeight }}
              />

              {/* Floating Selection Action Bar */}
              {floatingMenuPos && (
                <div
                  style={{ top: `${floatingMenuPos.top}px`, left: `${floatingMenuPos.left}px` }}
                  className="absolute z-30 flex items-center gap-1 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    type="button"
                    onClick={openInternalLinkModal}
                    className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Conectar Artículo</span>
                  </button>
                  <button
                    type="button"
                    onClick={openExternalLinkModal}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                  >
                    <Bold className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                  >
                    <Italic className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Floating Link Inspector Popover */}
              {activeLinkElement && linkInspectorPos && (
                <div
                  style={{ top: `${linkInspectorPos.top}px`, left: `${linkInspectorPos.left}px` }}
                  className="absolute z-30 p-3 bg-slate-900 border border-rose-500/40 rounded-xl shadow-2xl space-y-2 min-w-[280px] max-w-sm animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-rose-400" />
                      <span>{activeLinkElement.getAttribute('data-internal-article') ? 'Enlace Interno KAIROSION' : 'Enlace Web'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveLinkElement(null)}
                      className="text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="text-xs text-white font-medium truncate">
                    {activeLinkElement.textContent}
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400 truncate">
                    {activeLinkElement.getAttribute('href')}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    {activeLinkElement.getAttribute('data-internal-article') && (
                      <button
                        type="button"
                        onClick={() => {
                          const currentSlug = activeLinkElement.getAttribute('data-internal-article');
                          setSelectedText(activeLinkElement.textContent || '');
                          setLinkDisplayText(activeLinkElement.textContent || '');
                          setArticleSearchQuery('');
                          setLinkTab('internal');
                          setLinkModalOpen(true);
                        }}
                        className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 rounded text-[11px] font-medium"
                      >
                        Cambiar Artículo
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newText = prompt('Nuevo texto para el enlace:', activeLinkElement.textContent || '');
                        if (newText !== null && newText.trim()) {
                          activeLinkElement.textContent = newText.trim();
                          handleContentChange();
                        }
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium"
                    >
                      Editar Texto
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleRemoveExistingLink}
                      className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded text-[11px] font-medium flex items-center gap-1"
                    >
                      <Unlink className="w-3 h-3" />
                      <span>Desvincular</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Clean Raw HTML Code Mode */
            <textarea
              rows={14}
              value={rawHtml}
              onChange={(e) => {
                setRawHtml(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="Escribe o pega HTML limpio aquí..."
              className="w-full p-4 bg-slate-950 border border-amber-500/40 rounded-2xl font-mono text-xs text-amber-200 leading-relaxed focus:outline-hidden focus:border-amber-400 shadow-inner"
              style={{ minHeight }}
            />
          )}

        </div>

        {/* Opportunities Sidebar Drawer */}
        {showOpportunities && detectedOpportunities.length > 0 && (
          <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3 shadow-lg">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Oportunidades de Enlazado ({detectedOpportunities.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowOpportunities(false)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Conceptos clave detectados en tu redacción que coinciden con artículos existentes en KAIROSION:
            </p>

            <div className="space-y-2.5">
              {detectedOpportunities.map((opp, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        Palabra detectada: <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-bold">"{opp.term}"</strong>
                      </div>
                      <div className="text-xs font-bold text-slate-200 line-clamp-1">
                        {opp.title}
                      </div>
                    </div>
                  </div>

                  {opp.article && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-400">
                        {opp.article.category}
                      </span>
                      <span>·</span>
                      <span>{opp.article.readTimeMinutes} min lectura</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => applyOpportunity(opp)}
                      className="flex-1 px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Conectar Enlace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIgnoredOpportunities(prev => [...prev, opp.term])}
                      className="p-1 text-slate-500 hover:text-slate-300 text-xs rounded hover:bg-slate-800"
                      title="Ignorar sugerencia"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* 1. INTERNAL & EXTERNAL LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLinkTab('internal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    linkTab === 'internal' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Conectar Artículo Existente (Interno)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLinkTab('external')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    linkTab === 'external' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Enlace Externo (URL)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Anchor Text input */}
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Texto del Enlace (Palabra o Frase Seleccionada)
              </label>
              <input
                type="text"
                value={linkDisplayText}
                onChange={(e) => setLinkDisplayText(e.target.value)}
                placeholder="Texto ancla que verá el lector..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-rose-400 font-medium"
              />
            </div>

            {/* Tab 1: Internal Article Search & Selector */}
            {linkTab === 'internal' && (
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar artículo por título, categoría, personajes (ej: Lucia, Vice City, Guía)..."
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400"
                    autoFocus
                  />
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Selecciona el artículo al que enlazar:</span>
                  <span>{filteredArticles.length} resultados disponibles</span>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[340px]">
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => insertInternalArticleLink(art)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 hover:bg-slate-900/80 transition-all flex items-center gap-3.5 group cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
                        <img 
                          src={art.featuredImage.url} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold">
                            {art.categoryLabel || art.category}
                          </span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">
                            {new Date(art.publishedAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          /articulo/{art.slug}
                        </div>
                      </div>

                      {/* Select CTA */}
                      <div className="shrink-0 px-2.5 py-1 rounded bg-slate-800 group-hover:bg-rose-500 text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">
                        Conectar →
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 2: External Link */}
            {linkTab === 'external' && (
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    URL Externa de Destino
                  </label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://ejemplo.com/recurso"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono focus:outline-hidden focus:border-cyan-400"
                    autoFocus
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span>Abrir enlace en una pestaña nueva (target="_blank" rel="noopener noreferrer")</span>
                </label>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={insertExternalLink}
                    disabled={!externalUrl || externalUrl === 'https://'}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Insertar Enlace Externo</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. INSERT TABLE MODAL */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-blue-400" />
                <span>Insertar Tabla Comparativa</span>
              </h3>
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Filas de Datos
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Columnas
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={tableHasHeader}
                onChange={(e) => setTableHasHeader(e.target.checked)}
                className="rounded border-slate-700 text-blue-500"
              />
              <span>Incluir fila de encabezado (Headers)</span>
            </label>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Insertar Tabla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. INSERT IMAGE MODAL */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageTab('library')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    imageTab === 'library' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Biblioteca Multimedia ({media.length})
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    imageTab === 'url' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Pegar URL de Imagen
                </button>
              </div>

              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {imageTab === 'library' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 p-1 max-h-[300px]">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setImageUrl(item.url);
                      setImageAlt(item.alt);
                      setImageCaption(item.caption);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      imageUrl === item.url 
                        ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-500/20' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-900">
                      <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-300 truncate">{item.name}</div>
                  </div>
                ))}
              </div>
            )}

            {imageTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    URL directa de la imagen
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Image Metadata Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Texto ALT (Para SEO)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descripción de la imagen..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Pie de Foto / Caption
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Pie de foto visible..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Alineación:</span>
                {(['center', 'left', 'right', 'full'] as const).map(align => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setImageAlign(align)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      imageAlign === align ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs"
              >
                Insertar en el Artículo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. INSERT CALLOUT BOX MODAL */}
      {calloutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Insertar Caja Informativa / Callout</span>
              </h3>
              <button
                type="button"
                onClick={() => setCalloutModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Tipo de Caja
              </label>
              <select
                value={calloutType}
                onChange={(e) => setCalloutType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
              >
                <option value="info">ℹ️ Información / Aviso Editorial</option>
                <option value="warning">⚠️ Advertencia Táctica / Alerta</option>
                <option value="tip">💡 Consejo / Estrategia</option>
                <option value="rockstar-note">★ Nota Oficial Rockstar Games</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Título del Callout
              </label>
              <input
                type="text"
                value={calloutTitle}
                onChange={(e) => setCalloutTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Contenido del Callout
              </label>
              <textarea
                rows={3}
                value={calloutContent}
                onChange={(e) => setCalloutContent(e.target.value)}
                placeholder="Escribe el texto informativo..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCalloutModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInsertCallout}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
              >
                Insertar Callout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
