import React from 'react';
import { ContentVerificationType } from '../../types';
import { ShieldCheck, Sparkles, AlertCircle, Users, Compass, Zap } from 'lucide-react';

interface VerificationBadgeProps {
  type: ContentVerificationType;
  className?: string;
  showIcon?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  className = '',
  showIcon = true,
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'oficial':
        return {
          label: 'OFICIAL ROCKSTAR',
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          icon: ShieldCheck,
          accent: 'text-emerald-400'
        };
      case 'actualizacion':
        return {
          label: 'ACTUALIZACIÓN',
          bg: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
          icon: Sparkles,
          accent: 'text-blue-400'
        };
      case 'rumor-verificado':
        return {
          label: 'RUMOR VERIFICADO',
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          icon: AlertCircle,
          accent: 'text-amber-400'
        };
      case 'comunidad':
        return {
          label: 'COMUNIDAD',
          bg: 'bg-purple-950/60 border-purple-500/40 text-purple-300',
          icon: Users,
          accent: 'text-purple-400'
        };
      case 'guia-estrategica':
        return {
          label: 'GUÍA PASO A PASO',
          bg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
          icon: Compass,
          accent: 'text-cyan-400'
        };
      case 'truco-rapido':
      default:
        return {
          label: 'TRUCO / CONSEJO',
          bg: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
          icon: Zap,
          accent: 'text-rose-400'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${config.bg} ${className}`}
      title={`Tipo de contenido: ${config.label}`}
    >
      {showIcon && <Icon className={`w-3 h-3 ${config.accent}`} />}
      <span>{config.label}</span>
    </span>
  );
};
