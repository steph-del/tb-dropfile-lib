export interface FileData {
  index: number;
  file: File;
  arrayBuffer: any;
  dataUrl: any;
  initialFileSize?: number;
  imageReducerIterations?: number;
  imageIsToBigForUpload?: boolean;
  exifMetadata?: Array<{x: string}> | false;
  exifGPSLat?: {deg: number, min: number, sec: number};
  exifGPSLng?: {deg: number, min: number, sec: number};
  exifGPSAltitude?: number;
  uploaded: boolean | 'error';
}
