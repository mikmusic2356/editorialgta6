import React from 'react';
import { Article, MainCategorySlug, CharacterProfile, VehicleSpecs, WeaponSpecs, MapDistrict } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { HeroSlider } from './HeroSlider';
import { LatestNewsBlock } from './LatestNewsBlock';
import { TrendingBlock } from './TrendingBlock';
import { GuidesSectionBlock } from './GuidesSectionBlock';
import { TipsTricksBlock } from './TipsTricksBlock';
import { CharactersBlock } from './CharactersBlock';
import { DatabaseBlock } from './DatabaseBlock';
import { RockstarBlock } from './RockstarBlock';
import { Sparkles } from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: MainCategorySlug) => void;
  onSelectCharacter: (char: CharacterProfile) => void;
  onSelectVehicle: (v: VehicleSpecs) => void;
  onSelectWeapon: (w: WeaponSpecs) => void;
  onSelectDistrict: (d: MapDistrict) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
  onSelectCharacter,
  onSelectVehicle,
  onSelectWeapon,
  onSelectDistrict,
}) => {
  const { banners } = useCMS();

  return (
    <div className="w-full space-y-12">
      
      {/* 0. PORTADA PRINCIPAL FULL-WIDTH — HERO SLIDER CON BANNERS Y BOTONES PERSONALIZABLES */}
      <HeroSlider
        banners={banners}
        onSelectArticle={onSelectArticle}
        onSelectCategory={onSelectCategory}
      />

      {/* 1. PRIMER BLOQUE — LO MÁS RECIENTE / ÚLTIMAS NOTICIAS */}
      <LatestNewsBlock
        articles={articles}
        onSelectArticle={onSelectArticle}
        onSelectCategory={onSelectCategory}
      />

      {/* 2. SEGUNDO BLOQUE — EN TENDENCIA */}
      <TrendingBlock
        articles={articles}
        onSelectArticle={onSelectArticle}
      />

      {/* 3. TERCER BLOQUE — CENTRO DE GUÍAS & WALKTHROUGHS */}
      <GuidesSectionBlock
        articles={articles}
        onSelectArticle={onSelectArticle}
        onSelectCategory={onSelectCategory}
      />

      {/* 4. CUARTO BLOQUE — TRUCOS Y CONSEJOS RÁPIDOS */}
      <TipsTricksBlock
        onSelectCategory={onSelectCategory}
      />

      {/* 5. QUINTO BLOQUE — EXPEDIENTES DE PERSONAJES */}
      <CharactersBlock
        onSelectCharacter={onSelectCharacter}
        onSelectCategory={onSelectCategory}
      />

      {/* 6. SEXTO BLOQUE — BASES DE DATOS (VEHÍCULOS, ARMAS, MAPA) */}
      <DatabaseBlock
        onSelectVehicle={onSelectVehicle}
        onSelectWeapon={onSelectWeapon}
        onSelectDistrict={onSelectDistrict}
        onSelectCategory={onSelectCategory}
      />

      {/* 7. SÉPTIMO BLOQUE — ROCKSTAR GAMES & TAKE-TWO */}
      <RockstarBlock
        articles={articles}
        onSelectArticle={onSelectArticle}
        onSelectCategory={onSelectCategory}
      />

      {/* 8. NEWSLETTER / SUSCRIPCIÓN EDITORIAL */}
      <section className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950 border border-[#ffc456]/40 text-[#ffc456] text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#ffc456]" />
          <span>BOLETÍN EDITORIAL KAIROSION</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display max-w-xl mx-auto">
          Recibe cada análisis, guía y primicia de GTA 6 en tu correo
        </h3>
        <p className="text-sm text-white/90 max-w-md mx-auto font-light">
          Sin publicidad engañosa. Reportajes en profundidad, desgloses técnicos y avisos oficiales de Rockstar Games.
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            alert('¡Gracias por suscribirte al boletín editorial de KAIROSION!');
          }}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2"
        >
          <input
            type="email"
            placeholder="tu.correo@ejemplo.com"
            required
            className="flex-1 px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-hidden focus:border-[#ff6486]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#ff6486] hover:bg-[#ff6486]/90 rounded-lg shadow-md transition-colors cursor-pointer"
          >
            Suscribirme Gratis
          </button>
        </form>
      </section>

    </div>
  );
};
