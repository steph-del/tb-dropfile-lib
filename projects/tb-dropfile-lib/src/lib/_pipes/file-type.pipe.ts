import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform a mime type (ie 'application/json') into human readable type (ie 'Json file')
 * FileName parameter is optional => If Mime type can't be retrievied (null), we check file extension.
 */
@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {
  transform(value: any, fileName?: string): any {
    // images
    if (value === 'image/png') { return 'Image PNG'; }
    if (value === 'image/jpeg') { return 'Image JPEG'; }
    if (value === 'image/gif') { return 'Image GIF'; }
    if (value === 'image/bmp') { return 'Image BMP'; }

    // data
    if (value === 'application/pdf') { return 'Document PDF'; }
    if (value === 'application/json') { return 'Fichier Json'; }
    if (value === 'text/csv') { return 'Fichier CSV'; }
    if (value === 'application/gpx+xml') { return 'Fichier GPS'; }

    // documents
    if (value === 'application/vnd.oasis.opendocument.spreadsheet') { return 'Feuille de calcul'; }                      // .ods
    if (value === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') { return 'Fichier Excel'; }       // .xlsx
    if (value === 'application/vnd.ms-excel') { return 'Fichier Excel'; }                                                // .xls

    if (value === 'application/vnd.oasis.opendocument.text') { return 'Document texte'; }                               // .odt
    if (value === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { return 'Fichier Word'; } // .docx
    if (value === 'application/msword') { return 'Fichier Word'; }                                                      // .doc

    // other -- unrecognized
    if (value === '' && fileName) {
      const extension = fileName.substring(fileName.length - 4).toLowerCase();
      if (extension === '.gpx') { return 'Fichier GPS'; }
      if (extension === '.shp') { return 'Fichier Shapefile'; }
    }

    return 'Format inconnu';
  }
}
