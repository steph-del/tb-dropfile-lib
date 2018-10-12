export interface LatLngDMS {
  lat: DMS;
  lng: DMS;
}

export interface LatLngDMSAltitudePhotoName {
  lat: DMS;
  lng: DMS;
  altitude: number;
  photoName: string;
}

export interface DMS {
  deg: number;
  min: number;
  sec: number;
}
