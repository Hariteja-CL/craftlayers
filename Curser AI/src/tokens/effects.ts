type ShadowLayer = {
  color: string;
  offset: [number, number];
  radius: number;
  spread: number;
};

export const effects = {
  buttonShadow: [
    { color: 'rgba(50, 50, 71, 0.06)', offset: [0, 4], radius: 4, spread: 0 },
    { color: 'rgba(50, 50, 71, 0.08)', offset: [0, 4], radius: 8, spread: 0 },
  ] as ShadowLayer[],
  dropdownShadow: [
    { color: 'rgba(0, 0, 0, 0.26)', offset: [0, 2], radius: 12, spread: 0 },
  ] as ShadowLayer[],
  dropdown1: [
    { color: 'rgba(0, 0, 0, 0.11)', offset: [0, 7], radius: 3.63, spread: 0 },
    { color: 'rgba(0, 0, 0, 0.13)', offset: [0, -6.46], radius: 14.53, spread: 0 },
  ] as ShadowLayer[],
};

export type { ShadowLayer };