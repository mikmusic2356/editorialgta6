import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { AuthorItem } from '../../types/cms';
import { MediaPickerModal } from './MediaPickerModal';
import { uploadToR2 } from '../../lib/r2Service';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Mail, 
  Twitter, 
  Instagram, 
  Youtube, 
  Video, 
  Globe, 
  Image as ImageIcon, 
  Cloud, 
  Loader2, 
  CheckCircle2, 
  X, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AdminAuthors: React.FC = () => {
  const { authors, addAuthor, updateAuthor, deleteAuthor, articles } = useCMS();

  const [isAdding, setIsAdding] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  const [bio, setBio] = useState('');
  
  // Social Networks
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialTiktok, setSocialTiktok] = useState('');
  const [socialTwitch, setSocialTwitch] = useState('');
  const [socialWebsite, setSocialWebsite] = useState('');

  const [isAiAgent, setIsAiAgent] = useState(false);

  // Media Picker & Direct R2 Upload for Avatar
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleStartEdit = (auth: AuthorItem) => {
    setEditingAuthor(auth);
    setName(auth.name);
    setRole(auth.role);
    setEmail(auth.email || '');
    setAvatar(auth.avatar);
    setBio(auth.bio || '');
    setSocialTwitter(auth.socialTwitter || '');
    setSocialInstagram(auth.socialInstagram || '');
    setSocialYoutube(auth.socialYoutube || '');
    setSocialTiktok(auth.socialTiktok || '');
    setSocialTwitch(auth.socialTwitch || '');
    setSocialWebsite(auth.socialWebsite || '');
    setIsAiAgent(auth.isAiAgent || false);
    setIsAdding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setEmail('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    setBio('');
    setSocialTwitter('');
    setSocialInstagram('');
    setSocialYoutube('');
    setSocialTiktok('');
    setSocialTwitch('');
    setSocialWebsite('');
    setIsAiAgent(false);
    setEditingAuthor(null);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!name.trim() || !role.trim()) {
      alert('Por favor, ingresa el Nombre Completo y el Cargo / Especialidad.');
      return;
    }

    const payload = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
      bio: bio.trim(),
      socialTwitter: socialTwitter.trim() || undefined,
      socialInstagram: socialInstagram.trim() || undefined,
      socialYoutube: socialYoutube.trim() || undefined,
      socialTiktok: socialTiktok.trim() || undefined,
      socialTwitch: socialTwitch.trim() || undefined,
      socialWebsite: socialWebsite.trim() || undefined,
      isAiAgent
    };

    if (editingAuthor) {
      updateAuthor(editingAuthor.id, payload);
    } else {
      addAuthor(payload);
    }

    resetForm();
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const result = await uploadToR2(file, file.name, 'autores');
      if (result && result.url) {
        setAvatar(result.url);
        setIsUploadingAvatar(false);
        setUploadSuccessToast(true);
        setTimeout(() => setUploadSuccessToast(false), 4000);
      } else {
        throw new Error('No se generó URL para la imagen');
      }
    } catch (err: any) {
      console.warn('Error subiendo avatar a R2, usando fallback local...', err);
      // Client-side fallback to base64 preview/storage
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          setUploadSuccessToast(true);
          setTimeout(() => setUploadSuccessToast(false), 4000);
        }
      };
      reader.readAsDataURL(file);
      setIsUploadingAvatar(false);
    }
  };

  const PRESET_AVATARS = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', label: 'Editorial 1' },
    { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80', label: 'Editorial 2' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', label: 'Editorial 3' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', label: 'Editorial 4' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80', label: 'Editorial 5' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80', label: 'IA Bot' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ff6486]/30 to-[#ffc456]/20 border border-[#ff6486]/40 text-[#ff6486]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
                Equipo Editorial & Gestión de Autores
              </h1>
              <p className="text-xs text-slate-400">
                Personaliza 100% las fotos de perfil, biografías, roles y redes sociales (Twitter, Instagram, YouTube, TikTok, Twitch y Web).
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Añadir Nuevo Autor / Redactor</span>
        </button>
      </div>

      {/* Add / Edit Form Modal or Inline Panel */}
      {(isAdding || editingAuthor) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-[#ff6486]/40 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#ff6486]/20 text-[#ff6486]">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {editingAuthor ? `Editar Perfil de Autor: ${editingAuthor.name}` : 'Crear Nuevo Perfil de Autor'}
              </h3>
            </div>

            <button
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Avatar & Photo Management (4 COLS) */}
            <div className="lg:col-span-4 space-y-4">
              <label className="text-xs font-mono uppercase text-[#ffc456] block font-bold">
                Fotografía / Avatar de Perfil *
              </label>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-[#ff6486] shadow-xl group bg-slate-900">
                  <img
                    src={avatar}
                    alt={name || 'Avatar'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div 
                    onClick={() => setMediaPickerOpen(true)}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[11px] font-bold text-white gap-1"
                  >
                    <ImageIcon className="w-5 h-5 text-[#ffc456]" />
                    <span>Cambiar Foto</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-[#ff6486] hover:opacity-90 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Cloud className="w-3.5 h-3.5 fill-slate-950" />
                    )}
                    <span>{isUploadingAvatar ? 'Subiendo Fotografía...' : 'Subir Archivo de Foto (R2)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#ffc456]" />
                    <span>Seleccionar de la Galería</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1 text-left">
                    O pegar URL directa de imagen:
                  </label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase text-left mb-1.5">
                    Avatares Rápidos de Muestra:
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {PRESET_AVATARS.map((p, idx) => (
                      <img
                        key={idx}
                        src={p.url}
                        alt={p.label}
                        onClick={() => setAvatar(p.url)}
                        title={p.label}
                        className={`w-7 h-7 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-110 ${
                          avatar === p.url ? 'border-[#ff6486] ring-2 ring-[#ff6486]/40' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Profile Info & Social Networks (8 COLS) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                    Nombre Completo del Autor *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Marcos Valiente"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-hidden focus:border-[#ff6486]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#ffc456] block mb-1 font-bold">
                    Cargo / Especialidad Editorial *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Jefe de Redacción & Especialista GTA 6"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-hidden focus:border-[#ff6486]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Email Profesional / Contacto
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="email"
                    placeholder="redactor@leonidachronicle.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-[#ff6486]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Biografía Editorial & Trayectoria
                </label>
                <textarea
                  rows={3}
                  placeholder="Escribe un resumen sobre la experiencia, cobertura de juegos, análisis de patentes y especialidad del autor..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-hidden focus:border-[#ff6486]"
                />
              </div>

              {/* Comprehensive Social Media Channels */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono uppercase text-[#ff6486] font-bold flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Redes Sociales & Canales del Autor</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Visibles en la tarjeta del artículo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Twitter / X */}
                  <div>
                    <label className="text-[11px] font-mono text-cyan-400 block mb-1 flex items-center gap-1 font-bold">
                      <Twitter className="w-3.5 h-3.5" />
                      <span>X / Twitter</span>
                    </label>
                    <input
                      type="text"
                      placeholder="@usuario o enlace completo"
                      value={socialTwitter}
                      onChange={(e) => setSocialTwitter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="text-[11px] font-mono text-pink-400 block mb-1 flex items-center gap-1 font-bold">
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </label>
                    <input
                      type="text"
                      placeholder="@usuario o https://instagram.com/..."
                      value={socialInstagram}
                      onChange={(e) => setSocialInstagram(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-pink-400"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="text-[11px] font-mono text-red-400 block mb-1 flex items-center gap-1 font-bold">
                      <Youtube className="w-3.5 h-3.5" />
                      <span>Canal de YouTube</span>
                    </label>
                    <input
                      type="text"
                      placeholder="@Canal o https://youtube.com/@..."
                      value={socialYoutube}
                      onChange={(e) => setSocialYoutube(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-red-400"
                    />
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="text-[11px] font-mono text-cyan-300 block mb-1 flex items-center gap-1 font-bold">
                      <Video className="w-3.5 h-3.5" />
                      <span>TikTok</span>
                    </label>
                    <input
                      type="text"
                      placeholder="@usuario o https://tiktok.com/@..."
                      value={socialTiktok}
                      onChange={(e) => setSocialTiktok(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-cyan-300"
                    />
                  </div>

                  {/* Twitch */}
                  <div>
                    <label className="text-[11px] font-mono text-purple-400 block mb-1 flex items-center gap-1 font-bold">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Canal de Twitch</span>
                    </label>
                    <input
                      type="text"
                      placeholder="nombre_canal o https://twitch.tv/..."
                      value={socialTwitch}
                      onChange={(e) => setSocialTwitch(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-purple-400"
                    />
                  </div>

                  {/* Website / Portafolio */}
                  <div>
                    <label className="text-[11px] font-mono text-[#ffc456] block mb-1 flex items-center gap-1 font-bold">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Sitio Web / Portafolio</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://miportafolio.com"
                      value={socialWebsite}
                      onChange={(e) => setSocialWebsite(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-hidden focus:border-[#ffc456]"
                    />
                  </div>

                </div>
              </div>

              {/* AI Badge Option */}
              <div className="pt-1">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 cursor-pointer hover:bg-purple-950/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAiAgent}
                    onChange={(e) => setIsAiAgent(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-purple-500/50 text-purple-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold block text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Identificar como Motor de Redacción Asistido por IA
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Muestra la insignia oficial de IA en los artículos generados o revisados por este perfil.
                    </span>
                  </div>
                </label>
              </div>

            </div>

          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between pt-5 border-t border-slate-800 gap-3">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-rose-600 to-pink-600 hover:opacity-90 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{editingAuthor ? 'Guardar Cambios de Perfil' : 'Guardar y Crear Autor'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Authors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-[#ffc456] font-bold flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Miembros del Equipo & Autores Registrados ({(authors || []).length})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(authors || []).filter(Boolean).map((auth) => {
            const authorArticleCount = (articles || []).filter(a => a && a.author?.name === auth.name && a.status !== 'papelera').length;

            return (
              <div
                key={auth.id || auth.name}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm ${
                  auth.isAiAgent 
                    ? 'bg-purple-950/20 border-purple-500/40 hover:border-purple-500/70' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Bar: Avatar & Role Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={auth.avatar || '/images/Personajes/Jason_Duval_01.webp'}
                          alt={auth.name || 'Autor'}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/Personajes/Jason_Duval_01.webp';
                          }}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                        />
                        {auth.isAiAgent && (
                          <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-purple-600 text-white shadow">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white text-base font-display">
                          <span>{auth.name}</span>
                        </div>
                        <div className="text-xs text-[#ff6486] font-mono font-semibold">{auth.role}</div>
                        {auth.email && (
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{auth.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[#ffc456] shrink-0">
                      {authorArticleCount} {authorArticleCount === 1 ? 'artículo' : 'artículos'}
                    </span>
                  </div>

                  {/* Bio */}
                  {auth.bio && (
                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                      {auth.bio}
                    </p>
                  )}

                  {/* Social Badges Grid */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-800/80">
                    {auth.socialTwitter && (
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                        <Twitter className="w-3 h-3" />
                        <span>{auth.socialTwitter}</span>
                      </span>
                    )}
                    {auth.socialInstagram && (
                      <span className="px-2 py-0.5 rounded bg-pink-950/40 border border-pink-500/30 text-[11px] font-mono text-pink-300 flex items-center gap-1">
                        <Instagram className="w-3 h-3 text-pink-400" />
                        <span>{auth.socialInstagram}</span>
                      </span>
                    )}
                    {auth.socialYoutube && (
                      <span className="px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-[11px] font-mono text-red-300 flex items-center gap-1">
                        <Youtube className="w-3 h-3 text-red-400" />
                        <span>YouTube</span>
                      </span>
                    )}
                    {auth.socialTiktok && (
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[11px] font-mono text-cyan-200 flex items-center gap-1">
                        <Video className="w-3 h-3 text-cyan-300" />
                        <span>TikTok</span>
                      </span>
                    )}
                    {auth.socialTwitch && (
                      <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-purple-400" />
                        <span>Twitch</span>
                      </span>
                    )}
                    {auth.socialWebsite && (
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-[#ffc456] flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>Web</span>
                      </span>
                    )}
                  </div>

                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleStartEdit(auth)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-[#ff6486] rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Perfil</span>
                  </button>
                  {authors.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar el perfil de autor "${auth.name}"?`)) {
                          deleteAuthor(auth.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      title="Eliminar autor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Media Picker Modal for Avatars */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectMedia={(item) => {
          setAvatar(item.url);
          setMediaPickerOpen(false);
        }}
        title="Seleccionar Fotografía de Perfil / Avatar"
      />

    </div>
  );
};
