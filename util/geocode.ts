export async function getLocationName(latitude: number, longitude: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) {
    throw new Error('API key for OpenCage is not defined');
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const city =
        result.components.city ||
        result.components.town ||
        result.components.village ||
        '';
      const country = result.components.country || '';
      return { city, country };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return { city: '', country: '' };
  }
}

export async function getCityAndCountry(
  latitude: number,
  longitude: number,
): Promise<{ city: string; country: string }> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }

  const data = await response.json();
  const city =
    data.address.city || data.address.town || data.address.village || 'Unknown';
  const country = data.address.country || 'Unknown';
  return { city, country };
}
