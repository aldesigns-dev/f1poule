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
  'bortoleto': 'gabriel-bortoleto'
};

export function getDriverSlug(driverId: string): string {
  // Controleer of de driverId in de driverSlugMap staat.
  if (driverSlugMap[driverId]) {
    // Als de driverId bestaat in de map, geef de slug terug.
    return driverSlugMap[driverId];
  } else {
    // Als de driverId niet bestaat, geef de originele driverId terug.
    return driverId;
  }
}