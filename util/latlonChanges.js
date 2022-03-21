import proj4 from 'proj4';

const lengthRectangle2 = (startLon, startLat, destLon, destLat) => {
  let firstProjection =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'; // WGS84 - EPSG:4326
  let secondProjection;
  let lon_range = Number(destLon);
  switch (true) {
    case 124 < lon_range && lon_range <= 126:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5185
      break;
    case 126 < lon_range && lon_range <= 128:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5186
      break;
    case 128 < lon_range && lon_range <= 130:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5187
      break;
    case 130 < lon_range && lon_range <= 132:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5188
      break;

    default:
      console.log('secondProjection is Non');
      break;
  }

  //I'm not going to redefine those two in latter examples.
  let start_lec_latlon = proj4(firstProjection, secondProjection, [
    Number(startLon),
    Number(startLat),
  ]);
  let dest_lec_latlon = proj4(firstProjection, secondProjection, [
    Number(destLon),
    Number(destLat),
  ]);

  let lat = start_lec_latlon[0] - dest_lec_latlon[0];
  let lon = start_lec_latlon[1] - dest_lec_latlon[1];
  return [lon, lat];
};

const lengthRectangle = (startLon, startLat, destLon, destLat) => {
  let firstProjection =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'; // WGS84 - EPSG:4326
  let secondProjection;
  let lon_range = Number(destLon);
  switch (true) {
    case 124 < lon_range && lon_range <= 126:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5185
      break;
    case 126 < lon_range && lon_range <= 128:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5186
      break;
    case 128 < lon_range && lon_range <= 130:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5187
      break;
    case 130 < lon_range && lon_range <= 132:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5188
      break;

    default:
      console.log('secondProjection is Non');
      break;
  }

  //I'm not going to redefine those two in latter examples.
  let start_lec_latlon = proj4(firstProjection, secondProjection, [
    Number(startLon),
    Number(startLat),
  ]);
  let dest_lec_latlon = proj4(firstProjection, secondProjection, [
    Number(destLon),
    Number(destLat),
  ]);

  let lat = start_lec_latlon[0] - dest_lec_latlon[0];
  let lon = start_lec_latlon[1] - dest_lec_latlon[1];
  return [lon, lat];
};

const Rectangle_range = (lon, lat) => {
  let firstProjection =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'; // WGS84 - EPSG:4326
  let secondProjection;
  let lon_range = Number(lon);
  switch (true) {
    case 124 < lon_range && lon_range <= 126:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5185
      break;
    case 126 < lon_range && lon_range <= 128:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5186
      break;
    case 128 < lon_range && lon_range <= 130:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5187
      break;
    case 130 < lon_range && lon_range <= 132:
      secondProjection =
        '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // 5188
      break;

    default:
      break;
  }

  let lec_latlon = proj4(firstProjection, secondProjection, [
    Number(lon),
    Number(lat),
  ]);
  //lat, lon
  return [lec_latlon[0], lec_latlon[1]];
};

// 부산 전용 직각좌표 수정

// result orthogonal
const busan_Rectangle_range = (lon, lat) => {
  let firstProjection =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'; // WGS84 - EPSG:4326
  let secondProjection =
    '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

  let lec_latlon = proj4(firstProjection, secondProjection, [
    Number(lon),
    Number(lat),
  ]);
  //lat, lon
  return [lec_latlon[0], lec_latlon[1]];
};

// result lonlat
const busan_Rectangle_WGS84 = (lon, lat) => {
  let firstProjection =
    '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'; // WGS84 - EPSG:4326
  let secondProjection =
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees';

  let lec_latlon = proj4(firstProjection, secondProjection, [
    Number(lon),
    Number(lat),
  ]);
  //lat, lon
  return [lec_latlon[0], lec_latlon[1]];
};

module.exports = {
  lengthRectangle2,
  lengthRectangle,
  Rectangle_range,
  busan_Rectangle_range,
  busan_Rectangle_WGS84,
};
