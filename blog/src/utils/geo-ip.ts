export const getGeoLocation = async (ip: string) => {
  console.log("ip", ip);

  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  console.log("ip data", data);

  return {
    country: data.country_code,
    region: data.region,
    city: data.city,
    latitude: data.latitude,
    longitude: data.longitude,
  };
};
