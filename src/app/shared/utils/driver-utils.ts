const driverSlugMap: { [key: string]: string } = {
  'norris': 'lando-norris',
  'piastri': 'oscar-piastri',
  'max_verstappen': 'max-verstappen',
  'russell': 'george-russell',
  'leclerc': 'charles-leclerc',
  'antonelli': 'kimi-antonelli',
  'hamilton': 'lewis-hamilton',
  'albon': 'alexander-albon',
  'ocon': 'esteban-ocon',
  'stroll': 'lance-stroll',
  'gasly': 'pierre-gasly',
  'hulkenberg': 'nico-hulkenberg',
  'bearman': 'oliver-bearman',
  'tsunoda': 'yuki-tsunoda',
  'hadjar': 'isack-hadjar',
  'sainz': 'carlos-sainz',
  'alonso': 'fernando-alonso',
  'lawson': 'liam-lawson',
  'doohan': 'jack-doohan',
  'bortoleto': 'gabriel-bortoleto',
  'colapinto': 'franco-colapinto'
};

const driverNationalityMap: { [key: string]: string } = {
  'Australian': 'Australië',
  'Brazilian': 'Brazilië',
  'British': 'Engeland',
  'Canadian': 'Canada',
  'Dutch': 'Nederland',
  'French': 'Frankrijk',
  'German': 'Duitsland',
  'Italian': 'Italië',
  'Japanese': 'Japan',
  'Monegasque': 'Monaco',
  'New Zealander': 'Nieuw-Zeeland',
  'Spanish': 'Spanje',
  'Thai': 'Thailand',
  'Argentine': 'Argentinië'
};

const driverNationalityFlagMap: { [key: string]: string } = {
  'Australian': 'au',
  'Brazilian': 'br',
  'British': 'gb',
  'Canadian': 'ca',
  'Dutch': 'nl',
  'French': 'fr',
  'German': 'de',
  'Italian': 'it',
  'Japanese': 'jp',
  'Monegasque': 'mc',
  'New Zealander': 'nz',
  'Spanish': 'es',
  'Thai': 'th',
  'Argentine': 'ar'
};

export function getDriverSlug(driverId: string): string {
  if (driverSlugMap[driverId]) {
    return driverSlugMap[driverId];
  } else {
    return driverId;
  }
};

export function getDriverNationality(nationality: string): string {
  return driverNationalityMap[nationality] ?? nationality;
}

export function getFlagImage(nationality: string): string {
  const fileName = driverNationalityFlagMap[nationality] ?? 'default';
  return `assets/country-flags/${fileName}.png`;
};

export function getDriverImage(driverId: string): string {
  return `assets/drivers/${getDriverSlug(driverId)}.png`;
}