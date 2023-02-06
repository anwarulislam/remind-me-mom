type Location = {
  lat: number;
  long: number;
};

/**
 * calculates distance between two locations
 * @param {Location} location1
 * @param {Location} location2
 * @returns {number} distance in feet
 */
export const calculateDistance = (location1: Location, location2: Location) => {
  const lat1 = location1.lat;
  const lat2 = location2.lat;
  const lon1 = location1.long;
  const lon2 = location2.long;

  // console.log({ lat1, lon1 }, { lat2, lon2 });

  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);

  // nautical miles
  dist = (dist * 180) / Math.PI;

  // statute miles
  dist = dist * 60 * 1.1515;

  // feet
  return dist * 5280;
};
