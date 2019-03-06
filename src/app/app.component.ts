import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  _reset: boolean;

  acceptedFiles(data) {
    console.log(data);
  }

  rejectedFiles(data) {
    console.log(data);
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

  public reset() {
    this._reset = true;
    setTimeout(() => {
      this._reset = false;
    }, 100);
  }
}
