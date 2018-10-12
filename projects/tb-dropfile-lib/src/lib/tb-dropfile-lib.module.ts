import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatTableModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { TbDropfileLibComponent } from './tb-dropfile-lib.component';
import { DropBoxComponent } from './drop-box/drop-box.component';
import { DroppableDirective } from './droppable.directive';
import { FileTypePipe } from './_pipes/file-type.pipe';
import { FileSizePipe } from './_pipes/file-size.pipe';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule, MatTableModule, MatButtonModule, MatTooltipModule, MatIconModule
  ],
  declarations: [TbDropfileLibComponent, DropBoxComponent, DroppableDirective, FileTypePipe, FileSizePipe],
  exports: [TbDropfileLibComponent, DropBoxComponent]
})
export class TbDropfileLibModule { }
