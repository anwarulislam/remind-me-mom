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
  const { lat: lat1, long: lon1 } = JSON.parse(JSON.stringify(location1));
  const { lat: lat2, long: lon2 } = JSON.parse(JSON.stringify(location2));

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
  return Math.round(dist * 5280);
};
