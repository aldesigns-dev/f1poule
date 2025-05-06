const countryFlagMap: { [key: string]: string } = {
  'Australia': 'au',
  'Austria': 'at',
  'Azerbaijan': 'az',
  'Bahrain': 'bh',
  'Belgium': 'be',
  'Brazil': 'br',
  'Canada': 'ca',
  'China': 'cn',
  'France': 'fr',
  'Germany': 'de',
  'Hungary': 'hu',
  'Italy': 'it',
  'Japan': 'jp',
  'Mexico': 'mx',
  'Monaco': 'mc',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Qatar': 'qa',
  'Saudi Arabia': 'sh',
  'Singapore': 'sg',
  'Spain': 'es',
  'Thailand': 'th',
  'UAE': 'ae',
  'UK': 'gb',
  'USA': 'us',
};

export function getCountryFlagImage(country: string): string {
  const fileName = countryFlagMap[country] ?? 'default';
  return `assets/country-flags/${fileName}.png`;
}