import { Component, OnInit, DoCheck, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material';

import { FileData } from '../_models/fileData';
import { LatLngDMS, LatLngDMSAltitudePhotoName } from '../_models/gpsLatLng';
import { RejectedFileData } from '../_models/rejectedFileData';
import * as IM from '../_helpers/imageManipulator';
import { acceptRejectFiles } from '../_helpers/acceptRejectFiles';
import { getLatLngFromJpegArrayBuffer, getAltitudeFromJpegArrayBuffer } from '../_helpers/gpsTools';

/**
 * DropBox component
 * Drag and drop files into component
 * allowFullWindowDrop option allows to drop files on the entire window
 * Images files (imageFile) and other files (file) are managed separately
 * Can restrict file types (Mime types) and set a max file / imageFile size
 * Can preview images, rotate (left, right) and resize (if image size > maxImageFileSize)
 * Prefer restrict to 'jpeg' or 'png' format for images because resize and rotate functions should not work on other format (HTML5 canvas restriction)
 */
@Component({
  selector: 'tb-dropfile-box',
  templateUrl: './drop-box.component.html',
  styleUrls: ['./drop-box.component.scss']
})
export class DropBoxComponent implements OnInit, DoCheck {
  @ViewChild('table') table: MatTable<any>;

  //
  // INPUT OUTPUT
  //
  @Input() label = 'Glissez vos fichiers ici';  // main label
  @Input() labelHelp = '';                      // secondary label (user help indications)
  @Input() labelFullWindow = 'Glissez vos fichiers ici';
  @Input() maxFileSize;                         //
  @Input() maxImageFileSize;                    //
  @Input() ignoreOversizedFiles = true;         // if true (default), oversized files are emitted in rejectedFiles; otherwise, files are going in the main pipe : accepetdFiles, then you have to manage !!
  @Input() ignoreOversizedImageFiles = false;   // same as above. note that user can resize images.
  @Input() allowFullWindowDrop = false;         // fullWindow drop enabled / disabled

  // File type is named by its extension but MIME type is checked
  // Accept jpeg, png, bmp, gif, pdf, json, ods, xls, xlsx, odt, doc, docx, gpx and shp
  // ie ['jpeg', 'png']
  @Input() allowedFileTypes: Array<string> = [];

  @Output() windowDrag: EventEmitter<'enter' | 'leave'> = new EventEmitter();       // indicates when the mouse drags on element or entire window and when it leaves
  @Output() acceptedFiles: EventEmitter<FileData[]> = new EventEmitter();           // all accepted files regarding to @Input conditions
  @Output() rejectedFiles: EventEmitter<RejectedFileData[]> = new EventEmitter();   // all rejected files, with messages (why it was rejected)
  @Output() geolocatedPhotoLatLng: EventEmitter<Array<LatLngDMSAltitudePhotoName>> = new EventEmitter(); // geolocations from photos

  @ViewChild('file') file;
  @ViewChild('dropzone') dropzone: ElementRef<HTMLInputElement>;

  //
  // VARS
  //
  public form: FormGroup;
  public fileList: FileData[] = [];
  public displayedColumns: string[] = ['name', 'size', 'type'];
  private acceptedFileTypes: Array<string> = ['jpeg', 'png', 'bmp', 'gif', 'pdf', 'json', 'ods', 'xls', 'xlsx', 'csv', 'odt', 'doc', 'docx', 'gpx', 'shp'];
  public canvas: HTMLCanvasElement;
  public dropZoneLabel = this.label;

  //
  // METHODS
  //
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      files: this.fb.control({value: '', disabled: false})
    });
  }

  ngOnInit() {
    this.canvas =  <HTMLCanvasElement> document.getElementById('canvas');
    // If allowedFileTypes is not provided, accept all types
    if (this.allowedFileTypes.length === 0) { this.allowedFileTypes = this.acceptedFileTypes; }

    // Checks that allowedFileTypes contains acceptable values
    // Throw an error without catching if a value is not acceptable !
    if (this.allowedFileTypes.length > 0) {
      this.allowedFileTypes.forEach(aft => {
        if (this.acceptedFileTypes.indexOf(aft) === -1) { throw new Error(`[tb-dropfile-box]: "${aft}" (in "allowedFileTypes") is not a valid or acceptable value.`); }
      });
    }

  }

  /**
   * Check when the dropzone is in full width and adapt the label accordingly
   */
  ngDoCheck() {
    if (this.dropzone.nativeElement.classList.contains('fullWindow')) {
      this.dropZoneLabel = this.labelFullWindow;
    } else {
      this.dropZoneLabel = this.label;
    }
  }

  /**
   * Files that have been accepted (format is valid/acceptable and size is acceptable)
   *
   * We need data as dataUrl for image preview
   * and also data as arrayBuffer to get exif metadata and to send data via API
   * So, we have 2 readers. As those readers are asynchronous functions, we have to know when both are terminated (loaded)
   * then, we can do this.acceptedFiles.next(fileList)
   * @param files is provided by the droppable directive
   */
  acceptedFilesChange(files: Array<File>) {
    for (let index = 0; index < files.length; index++) {
      const reader1 = new FileReader();
      const reader2 = new FileReader();
      let dataUrl: any = null;
      let arrayBuffer: any = null;
      let dataUrlIsLoaded = false;
      let arrayBufferIsLoaded = false;
      let GPSLatLng: any;
      let GPSAltitude: any;

      // data as dataUrl
      reader1.onload = (e) => {
        dataUrlIsLoaded = true;
        dataUrl = reader1.result;
        // arrayBuffer = null;
        if (dataUrlIsLoaded && arrayBufferIsLoaded) {
          this.fileList.push({
            index: this.fileList.length,
            file: files[index],
            arrayBuffer: arrayBuffer,
            dataUrl: dataUrl,
            exifGPSLat: GPSLatLng.lat,
            exifGPSLng: GPSLatLng.lng,
            exifGPSAltitude: GPSAltitude
          });
          if (index === files.length - 1) {
            // emit accepted files and gps metadata (latitude, longitude, altitude and file name)
            this.acceptedFiles.next(this.fileList);
            const latLngAltName = this.mergeLatLngAltitudeFromPhotos();
            if (latLngAltName.length > 0) { this.geolocatedPhotoLatLng.next(latLngAltName); }
          }
          this.renderRows();
        }
      };

      // data as arrayBuffer
      reader2.onload = (e) => {
        arrayBufferIsLoaded = true;
        arrayBuffer = reader2.result;

        // Get latitude, longitude and elevation from GPS exif metadata
        GPSLatLng = getLatLngFromJpegArrayBuffer(arrayBuffer);
        GPSAltitude = getAltitudeFromJpegArrayBuffer(arrayBuffer);

        if (dataUrlIsLoaded && arrayBufferIsLoaded) {
          this.fileList.push({
            index: this.fileList.length,
            file: files[index],
            arrayBuffer: arrayBuffer,
            dataUrl: dataUrl,
            exifGPSLat: GPSLatLng.lat,
            exifGPSLng: GPSLatLng.lng,
            exifGPSAltitude: GPSAltitude
          });
          if (index === files.length - 1) {
            // emit accepted files and gps metadata (latitude, longitude, altitude and file name)
            this.acceptedFiles.next(this.fileList);
            const latLngAltName = this.mergeLatLngAltitudeFromPhotos();
            if (latLngAltName.length > 0) { this.geolocatedPhotoLatLng.next(latLngAltName); }
          }
          this.renderRows();
        }
      };

      reader1.readAsDataURL(files[index]);
      reader2.readAsArrayBuffer(files[index]);
    }
  }

  /**
   * Files that have been rejected (not a valid/acceptable format or oversized file)
   * @param data is provided by the droppable directive
   */
  rejectedFilesChange(data: Array<RejectedFileData>) {
    this.rejectedFiles.next(data);
  }

  /**
   * see https://material.angular.io/components/table/api#MatTable
   * > If a data array is provided, the table must be notified when
   * > the array's objects are added, removed, or moved. This can be
   * > done by calling the renderRows() function
   */
  renderRows(): void {
    if (this.table) { this.table.renderRows(); }
  }

  /**
   * file is an image if mime type contains 'image' string
   */
  isImage(file: File): boolean {
    return file.type.search('image') !== -1 ? true : false;
  }

  /**
   * Use the canvas to rotate an image
   */
  imageRotate(imageData: FileData, direction: 'left' | 'right') {
    IM.rotateImage(this.canvas, imageData, direction);
  }

  /**
   * Use the canvas to reduce the size of an image
   *
   * IM.reduceImageSize() has a callback as last argument
   * While image size > maxImageSize, this callback refers to self reduceImageSize function
   */
  reduceImageFileSize(file: FileData) {
    IM.reduceImageSize(this.canvas, file, 0.7, () => {
      if (file.file.size > this.maxImageFileSize * 1000) { return this.reduceImageFileSize(file); }
    });
    this.acceptedFiles.next(this.fileList);
  }

  /**
   * Delete a file from fileList
   */
  deleteFile(fileToRemoveIndex: number) {
    this.fileList.splice(fileToRemoveIndex, 1);
    this.renderRows();
  }

  /**
   * When user selects select files by browsing his hard drive
   */
  onFilesInputChange() {
    const files = this.file.nativeElement.files;

    // Check if files (from event.dataTransfer) are accepted regarding of they MIME types and/or file extension + explicit options parameters
    const arfResult = acceptRejectFiles(files, this.allowedFileTypes, this.ignoreOversizedFiles, this.ignoreOversizedImageFiles);

    // Emit accepted and rejected files
    this.acceptedFilesChange(arfResult.acceptedFiles);
    this.rejectedFilesChange(arfResult.rejectedFiles);

  }

  /**
   * Send files via API
   */
  sendFiles(): void {

/*
curl -i -X POST -H "Content-Type:multipart/form-data" -F 'file=@/Users/steph/Documents/Dev/tb-common/celv2/2.JPG' -F "json=@/Users/steph/Documents/Dev/tb-common/celv2/0.json" http://127.0.0.1:8000/api/photos
*/



// console.log('Send files...');
// console.log(this.fileList[0]);
// console.log(this.fileList[0].file);
// console.log(JSON.stringify(this.fileList[0].file));
    const formData = new FormData(); // for (var data of temp1.entries()) { console.log(data)}
    const dataView = new DataView(this.fileList[0].arrayBuffer);
    const blob = new Blob([dataView], { type: this.fileList[0].file.type});
// console.log(blob);
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8000/*',
        'enctype': 'multipart/form-data'
      })
    };
    const photoFile = new File([blob], 'test.jpg');
    const jsonData = {
      userEmail: 'stephane.delplanque@e-mail.com',
      userFirstName: 'Stephane',
      userLastName: 'Delplanque',
      originalName: 'test.jpg',
      mediaObject : '/api/media_objects/1',
      dateShot: '2018-08-18T16:34:15.017Z' };
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {type: 'text/plain'});
    const jsonFile = new File([jsonBlob], 'data.json');
    formData.append('file', photoFile);
    formData.append('json', jsonFile);
    // formData.append('file', this.fileList[0].file, this.fileList[0].file.name);
// console.log(photoFile);
// console.log(jsonFile);
// console.log(formData);

    /* const request = new XMLHttpRequest();
    request.open('POST', 'http://127.0.0.1:8000/api/photos');
    request.send(formData);*/


    this.http.post('http://127.0.0.1:8000/api/photos', formData, httpOptions).subscribe(r => {
      console.log('SUCCESS');
      console.log(r);
    }, e => {
      console.log('ERROR');
      console.log(e);
    });

    // show spinner
    // get data (arrayBuffer ?)
    // send multiFormPart
    // if response = 200, emit Lat/lng image GPS metadata
    // if response != 200, manage error

  }

  /**
   * Mimic a click on the input field (hidden)
   */
  addFiles() {
    this.file.nativeElement.click();
  }

  /**
   * Here we merge gps metadata informations from fileList images to simplify the process of sending out of the component
   * latitude, longitude, altitude and file name at the same time so parent component can easily
   * get thoses grouped data
   */
  private mergeLatLngAltitudeFromPhotos(): Array<LatLngDMSAltitudePhotoName> {
    const response: Array<LatLngDMSAltitudePhotoName> = [];
    if (this.fileList.length > 0) {
      this.fileList.forEach(data => {
        if (data.exifGPSLat && data.exifGPSLng && data.exifGPSAltitude) {
          response.push({
            lat: data.exifGPSLat,
            lng: data.exifGPSLng,
            altitude: data.exifGPSAltitude,
            photoName: data.file.name
          });
        }
      });
    }
    return response;
  }

}
