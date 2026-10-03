import React from 'react';

interface AdSlotProps {
  type: 'tower-left' | 'tower-right' | 'in-article' | 'between-blocks' | 'post-content';
  slotId?: string;
  className?: string;
}

/**
 * AdSlot Component
 * Configured as clean transparent hook for Google Auto-Ads without UI placeholders.
 */
export const AdSlot: React.FC<AdSlotProps> = () => {
  return null;
};
