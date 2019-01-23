import { acceptedFileTypes } from '../_vars/acceptedFileTypes';

/**
 *
 */
export function acceptRejectFiles(
  files: Array<File>,
  allowedFileTypes: Array<string>,
  ignoreOversizedFiles: boolean,
  ignoreOversizedImageFiles: boolean,
  maxFileSize: number,
  maxImageFileSize: number): { acceptedFiles: Array<File>, rejectedFiles: Array<{file: File, message: string}> } {

  const acceptedFiles: Array<File> = [];
  const rejectedFiles: Array<{file: File, message: string}> = [];
  const _acceptedFileTypes = acceptedFileTypes;

  // limit number of files
  if (files.length > 50) {
    files = Array.prototype.slice.call(files, 0, 50); // slice() does not exists on a FileList object
  }

  // Push accepted files into acceptedFiles array
  // Push rejected files into rejectedFiles array
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      // max size -> not accepted
      if (!isImage(files[i]) && ignoreOversizedFiles && files[i].size > (maxFileSize * 1000)) { rejectedFiles.push({file: files[i], message: '[Droppable directive]: oversized file'}); continue; }
      if (isImage(files[i]) && ignoreOversizedImageFiles && files[i].size > (maxImageFileSize * 1000)) { rejectedFiles.push({file: files[i], message: '[Droppable directive]: oversized image file'}); continue; }

      // get file extension
      const ext = files[i].name.substring(files[i].name.length - 3).toLowerCase();

      // compare Mime types
      // get type (ie 'jpeg')
      let type = '';
      _acceptedFileTypes.forEach(af => {
        if (files[i].type === af.mime) { type = af.type; }
      });

      // accept or reject a file
      if (type !== '') {
        if (allowedFileTypes.indexOf(type) !== -1) {
          acceptedFiles.push(files[i]);
        } else {
          rejectedFiles.push({file: files[i], message: `[Droppable directive]: ${files[i].type} format is not valid`});
        }
      } else if (
        (ext === 'gpx' && allowedFileTypes.indexOf('gpx') !== -1)
        || ((ext === 'shp' && allowedFileTypes.indexOf('shp') !== -1))) {
        acceptedFiles.push(files[i]);
      }
    }
  }

  return { acceptedFiles: acceptedFiles, rejectedFiles: rejectedFiles };
}

export function isImage(file: File): boolean {
  return file.type.search('image') !== -1 ? true : false;
}
