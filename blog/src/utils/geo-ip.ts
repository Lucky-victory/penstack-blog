export const getGeoLocation = async (ip: string) => {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();

  return {
    country: data.country_code,
    region: data.region,
    city: data.city,
    latitude: data.latitude,
    longitude: data.longitude,
  };
};
