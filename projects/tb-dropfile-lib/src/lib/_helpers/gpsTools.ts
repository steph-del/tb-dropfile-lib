import * as Exif from 'exif-js';
import { DMS, LatLngDMS } from '../_models/gpsLatLng';

/**
 * Return latitude and longitude from jpeg exif metadata
 * For details, see exif.js cource code :
 * https://github.com/exif-js/exif-js
 */
export function getLatLngFromJpegArrayBuffer(arrayBuffer): LatLngDMS {
  let exifData: any | false;

  let _GPSLat: Array<{number, numerator: number, denominator: number}>;
  let _GPSLng: Array<{number, numerator: number, denominator: number}>;
  let GPSLat: DMS;
  let GPSLng: DMS;

  exifData = Exif.readFromBinaryFile(arrayBuffer);

  _GPSLat = exifData.GPSLatitude;
  _GPSLng = exifData.GPSLongitude;
  if (_GPSLat && _GPSLng) {
    GPSLat = {
      deg: (_GPSLat[0].numerator / _GPSLat[0].denominator),
      min: (_GPSLat[1].numerator / _GPSLat[1].denominator),
      sec: (_GPSLat[2].numerator / _GPSLat[2].denominator)
    };
    GPSLng = {
      deg: (_GPSLng[0].numerator / _GPSLng[0].denominator),
      min: (_GPSLng[1].numerator / _GPSLng[1].denominator),
      sec: (_GPSLng[2].numerator / _GPSLng[2].denominator)
    };
  }

  return _GPSLat ? {lat: GPSLat, lng: GPSLng} : {lat: null, lng: null};
}

/**
 * Return altitude (elevation) form jpeg exif metadata
 * For details, see exif.js cource code :
 * https://github.com/exif-js/exif-js
 */
export function getAltitudeFromJpegArrayBuffer(arrayBuffer) {
  let exifData: any | false;

  exifData = Exif.readFromBinaryFile(arrayBuffer);
console.log(exifData);
  return exifData.GPSAltitude ? (exifData.GPSAltitude.numerator / exifData.GPSAltitude.denominator) : null;
}
