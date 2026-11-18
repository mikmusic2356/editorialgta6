import React from 'react';

export type AdBannerFormat = '728x90' | '320x50' | '300x250' | '160x600';

export interface AdSlotProps {
  /**
   * Placement preset:
   * - 'leaderboard': Desktop 728x90, Mobile 320x50
   * - 'in-article': Desktop 728x90, Mobile 300x250
   * - 'rectangle': 300x250 on all devices (centered)
   * - 'skyscraper': 160x600 for wide desktop sidebars
   * - 'post-content': Desktop 728x90, Mobile 300x250
   * - 'tower-left' | 'tower-right': 160x600 for wide desktop
   * - 'between-blocks': Desktop 728x90, Mobile 300x250
   */
  type?: 'leaderboard' | 'in-article' | 'rectangle' | 'skyscraper' | 'post-content' | 'tower-left' | 'tower-right' | 'between-blocks';
  slotId?: string;
  className?: string;
}

/**
 * AdsterraUnit / Third-party unverified ad networks are completely disabled
 * to strictly comply with Google Ads & Google AdSense Publisher Policies.
 */
export const AdsterraUnit: React.FC<{ format: AdBannerFormat; label?: string }> = () => {
  return null;
};

/**
 * AdSlot: Reserved strictly for official Google AdSense units once approved.
 * Renders null when no official Google AdSense Publisher ID is active, ensuring
 * zero empty boxes, zero third-party scripts, and 100% Google policy compliance.
 */
export const AdSlot: React.FC<AdSlotProps> = () => {
  return null;
};

/**
 * StickySkyscrapers: Disabled until official Google AdSense units are enabled.
 */
export const StickySkyscrapers: React.FC = () => {
  return null;
};
