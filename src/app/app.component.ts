import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  _reset: boolean;
  _sendImages = false;
  enabled = true;

  acceptedFiles(data) {
    console.log('acceptedFiles', data);
  }

  rejectedFiles(data) {
    console.log('rejectedFiles', data);
  }

  deletedFiles(data) {
    console.log(data);
  }

  geolocatedPhotoLatLng(data) {
    console.log(data);
    console.log(JSON.stringify(data));
  }

  uploadedFiles(data) {
    console.log(data);
  }

  httpError(e) {
    console.log(e);
  }

  toggleEnabled(): void {
    this.enabled = !this.enabled;
  }

  reset() {
    this._reset = true;
    setTimeout(() => {
      this._reset = false;
    }, 100);
  }

  sendImages() {
    this._sendImages = true;
    setTimeout(() => {
      this._sendImages = false;
    }, 100);
  }
}
