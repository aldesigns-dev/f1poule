const constructorLogoMap: { [key: string]: string } = {
  'alpine': 'logo-alpine',
  'aston_martin': 'logo-aston-martin',
  'ferrari': 'logo-ferrari',
  'haas': 'logo-haas',
  'mclaren': 'logo-mclaren',
  'mercedes': 'logo-mercedes',
  'rb': 'logo-racing-bulls',
  'red_bull': 'logo-red-bull-racing',
  'sauber': 'logo-kick-sauber',
  'williams': 'logo-williams',
};

const constructorColorMap: { [key: string]: string } = {
  'alpine': 'oklch(67.4% 0.150963 238.6408)',
  'aston_martin': 'oklch(60.95% 0.1187 164.97)',
  'ferrari': 'oklch(58.6% 0.2382 26.09)',
  'haas': 'oklch(78.66% 0.0062 239.84)',
  'mclaren': 'oklch(73.19% 0.1858 52.98)',
  'mercedes': 'oklch(86.75% 0.1552 177.28)',
  'rb': 'oklch(67.98% 0.1681 265.61)',
  'red_bull': 'oklch(55.32% 0.1459 257.86)',
  'sauber': 'oklch(80.64% 0.2223 143.17)',
  'williams': 'oklch(54.05% 0.1913 258.97)',
};

const constructorNameMap: { [key: string]: string } = {
  'alpine': 'Alpine',
  'aston_martin': 'Aston Martin',
  'ferrari': 'Ferrari',
  'haas': 'Haas',
  'mclaren': 'McLaren',
  'mercedes': 'Mercedes',
  'rb': 'Racing Bulls',
  'red_bull': 'Red Bull Racing',
  'sauber': 'Kick Sauber',
  'williams': 'Williams',
}

export function getConstructorLogo(constructorId: string): string {
  return `assets/team-logos/${constructorLogoMap[constructorId] ?? 'logo-default'}.png`;
}

export function getConstructorColor(constructorId: string): string {
  return constructorColorMap[constructorId] ?? 'transparent';
}

export function getConstructorName(constructorId: string): string {
  return constructorNameMap[constructorId] ?? constructorId;
}