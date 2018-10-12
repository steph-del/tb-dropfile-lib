import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TbDropfileLibModule } from 'tb-dropfile-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, TbDropfileLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
