export type ViewportBand = 'mobile-small' | 'mobile' | 'tablet' | 'desktop' | 'wide';

export type ViewportDef = {
  id: string;
  width: number;
  height: number;
  band: ViewportBand;
  label: string;
};

/** US-popular sizes + Tailwind band boundaries (tablet ≥860, desktop ≥1280, wide ≥1440). */
export const viewports: ViewportDef[] = [
  { id: 'phone-360', width: 360, height: 800, band: 'mobile-small', label: 'Common Android' },
  { id: 'phone-390', width: 390, height: 844, band: 'mobile-small', label: 'iPhone 12–14 class' },
  { id: 'phone-414', width: 414, height: 896, band: 'mobile', label: 'Top US mobile share' },
  { id: 'tablet-768', width: 768, height: 1024, band: 'mobile', label: 'iPad portrait' },
  { id: 'tablet-820', width: 820, height: 1180, band: 'mobile', label: 'iPad Air/Pro portrait' },
  { id: 'tablet-860', width: 860, height: 900, band: 'tablet', label: 'tablet floor' },
  { id: 'laptop-1100', width: 1100, height: 900, band: 'tablet', label: 'Laptop + sidebar' },
  { id: 'desktop-1280', width: 1280, height: 900, band: 'desktop', label: 'desktop floor' },
  { id: 'laptop-1366', width: 1366, height: 768, band: 'desktop', label: 'Classic laptop' },
  { id: 'wide-1440', width: 1440, height: 900, band: 'wide', label: 'wide floor' },
  { id: 'laptop-1536', width: 1536, height: 864, band: 'wide', label: 'Windows @ 125%' },
  { id: 'desktop-1920', width: 1920, height: 1080, band: 'wide', label: 'Full HD' },
];

export const aboutViewports = viewports.filter((v) =>
  ['phone-390', 'desktop-1280'].includes(v.id),
);

export function isTablet(width: number): boolean {
  return width >= 860;
}

export function isDesktop(width: number): boolean {
  return width >= 1280;
}

export function isWide(width: number): boolean {
  return width >= 1440;
}
