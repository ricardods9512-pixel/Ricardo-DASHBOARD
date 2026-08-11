export const COUNTRY_COORDS: Record<string, { flag: string; lon: number; lat: number }> = {
  España: { flag: '🇪🇸', lon: -3.7, lat: 40.4 },
  México: { flag: '🇲🇽', lon: -99.1, lat: 19.4 },
  Argentina: { flag: '🇦🇷', lon: -58.4, lat: -34.6 },
  Colombia: { flag: '🇨🇴', lon: -74.1, lat: 4.6 },
  Chile: { flag: '🇨🇱', lon: -70.6, lat: -33.4 },
  Perú: { flag: '🇵🇪', lon: -77.0, lat: -12.0 },
  Venezuela: { flag: '🇻🇪', lon: -66.9, lat: 10.5 },
  Ecuador: { flag: '🇪🇨', lon: -78.5, lat: -0.2 },
  Uruguay: { flag: '🇺🇾', lon: -56.2, lat: -34.9 },
  Paraguay: { flag: '🇵🇾', lon: -57.6, lat: -25.3 },
  Bolivia: { flag: '🇧🇴', lon: -68.1, lat: -16.5 },
  'Estados Unidos': { flag: '🇺🇸', lon: -98.6, lat: 39.8 },
  Panamá: { flag: '🇵🇦', lon: -79.5, lat: 8.9 },
  'Costa Rica': { flag: '🇨🇷', lon: -84.1, lat: 9.9 },
  'República Dominicana': { flag: '🇩🇴', lon: -69.9, lat: 18.7 },
  Guatemala: { flag: '🇬🇹', lon: -90.5, lat: 14.6 },
  Honduras: { flag: '🇭🇳', lon: -87.2, lat: 14.1 },
  'El Salvador': { flag: '🇸🇻', lon: -89.2, lat: 13.7 },
  Nicaragua: { flag: '🇳🇮', lon: -86.2, lat: 12.1 },
  Cuba: { flag: '🇨🇺', lon: -77.8, lat: 21.5 },
  'Puerto Rico': { flag: '🇵🇷', lon: -66.6, lat: 18.2 },
  Francia: { flag: '🇫🇷', lon: 2.3, lat: 48.9 },
  Italia: { flag: '🇮🇹', lon: 12.5, lat: 41.9 },
  Alemania: { flag: '🇩🇪', lon: 10.5, lat: 51.2 },
  'Reino Unido': { flag: '🇬🇧', lon: -1.5, lat: 52.4 },
  Portugal: { flag: '🇵🇹', lon: -8.2, lat: 39.4 },
  Brasil: { flag: '🇧🇷', lon: -51.9, lat: -14.2 },
  Andorra: { flag: '🇦🇩', lon: 1.5, lat: 42.5 },
  Marruecos: { flag: '🇲🇦', lon: -6.8, lat: 33.9 },
  Bélgica: { flag: '🇧🇪', lon: 4.5, lat: 50.5 },
  Suiza: { flag: '🇨🇭', lon: 8.2, lat: 46.8 },
}

export const COUNTRY_NAMES = Object.keys(COUNTRY_COORDS)

// Proyección equirectangular simple sobre un lienzo de 1000x500
export function projectToMap(lon: number, lat: number) {
  const x = ((lon + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return { x, y }
}
