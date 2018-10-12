import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  acceptedFiles(data) {
    console.log(data);
  }

  rejectedFiles(data) {
    console.log(data);
  }

  geolocatedPhotoLatLng(data) {
    console.log(data);
    console.log(JSON.stringify(data));
  }
}
