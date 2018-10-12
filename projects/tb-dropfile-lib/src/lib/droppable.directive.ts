import { Directive, HostListener, HostBinding, EventEmitter, Output, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { acceptedFileTypes } from './_vars/acceptedFileTypes';
import { acceptRejectFiles } from './_helpers/acceptRejectFiles';

/**
 * Droppable directive
 * Allow drag & drop files on 'droppable' tagged element
 * _allowFullWindowDrop option allows to drop files on the entire window
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[droppable]'
})
export class DroppableDirective implements OnInit, OnDestroy {
  //
  // INPUT / OUTPUT
  //
  @Input() _allowedFileTypes: Array<string> = [];         // ie: ['jpeg', 'png']
  @Input() _maxFileSize: number;                          // in KB
  @Input() _maxImageFileSize: number;                     // in KB
  @Input() _ignoreOversizedFiles: boolean;                // if true, files that size > _maxFileSize are not emitted (filesRejectedEmitter)
  @Input() _ignoreOversizedImageFiles: boolean;           // same as above but for image files.
  @Input() _allowFullWindowDrop: boolean;                 // fullWindow drop enabled / disabled
  @Input() _windowDrag: EventEmitter<'enter' | 'leave'>;  // indicates when the mouse drags on window.document and when it leaves

  @Output() private _filesChangeEmitter: EventEmitter<File[]> = new EventEmitter();                              // accepted files
  @Output() private _filesRejectedEmitter: EventEmitter<{file: File, message: string}[]> = new EventEmitter();  // rejected files (size or format)

  //
  // VARS
  //
  private acceptedFileTypes = acceptedFileTypes;
  protected _elementClass: Array<string> = ['dropzone'];

  //
  // ANGULAR LISTENERS
  //
  _documentMouseOutHandler: any;
  _documentDragEnterHandler: any;

  @HostBinding('class') get elementClass(): string {
    return this._elementClass.join(' ');
  }

  /**
   * When user drags over element
   */
  @HostListener('dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this._elementClass = !this._allowFullWindowDrop ? ['dropzone over'] : this._elementClass;
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      //
    }
  }

  /**
   * When user leave element
   */
  @HostListener('dragleave', ['$event']) public onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this._elementClass = !this._allowFullWindowDrop ? ['dropzone'] : this._elementClass;
  }

  /**
   * When mouse leave element
   */
  @HostListener('mouseout', ['$event']) public onMouseOut(event) {
    event.preventDefault();
    event.stopPropagation();
    this._elementClass = ['dropzone'];
  }

  /**
   * When user drops files over element
   */
  @HostListener('drop', ['$event']) public onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this._elementClass = ['dropzone'];

    // Check if dropped files (from event.dataTransfer) are accepted regarding of they MIME types and/or file extension
    const arfResult = acceptRejectFiles(event.dataTransfer.files, this._allowedFileTypes, this._ignoreOversizedFiles, this._ignoreOversizedImageFiles);

    // Emit accepted and rejected files
    this._filesChangeEmitter.emit(arfResult.acceptedFiles);
    this._filesRejectedEmitter.emit(arfResult.rejectedFiles);

  }

  //
  // METHODS
  //

  constructor(private renderer: Renderer2) { }

  /**
   * Listen when user enter or leave window.document
   * When entered, set element class to "dropzone fullWindow"
   * When left, set element class to "dropzone"
   */
  ngOnInit() {
    //
    // Droppable directive already contains event listeners as HostListener
    // but those listeners are limited to <tb-dropfile-box> element
    // Here, we listen on window.document events
    //
    // We are not using document.addEventListener() js code because by this way pass over angular's renderer and then, unsubscription
    // would be very slippy. A better solution is to direclty use angular's renderer methods. The listen() method
    // has the advantage of returning an 'unlisten' method, called by ngOnDestroy()
    // see https://angular.io/api/core/Renderer2#listen
    //
    // dragleave and mouseout events do not react the same way with the Gecko user agent or Webkit UA.
    // it seems complicated to fit all browsers
    // dragleave should fit to our needs but doesn't work on Webkit UA (fired several times when it should not)
    // mouseout should also be suitable but doesn't work properly on Gecko UA
    if (this._allowFullWindowDrop) {
      this._documentMouseOutHandler = this.renderer.listen('document', 'mouseout', this.onDocumentMouseOutHandler.bind(this));

      this._documentDragEnterHandler = this.renderer.listen('document', 'dragenter', this.onDocumentDragEnterHandler.bind(this));

      this._windowDrag.subscribe(value => {
        if (value === 'enter') {
          this._elementClass = [];
          this._elementClass.push('dropzone');
          this._elementClass.push('fullWindow');
        } else if (value === 'leave') {
          this._elementClass = [];
          this._elementClass.push('dropzone');
        }
      });
    }
  }

  onDocumentMouseOutHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this._windowDrag.emit('leave');   // Tell directive that we left
  }

  onDocumentDragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this._windowDrag.emit('enter');   // Tell directive that we are dragging over window
  }

  ngOnDestroy() {
    if (this._allowFullWindowDrop) {
      if (this._documentMouseOutHandler) { this._documentMouseOutHandler(); }
      if (this._documentDragEnterHandler) { this._documentDragEnterHandler(); }
      this._windowDrag.unsubscribe();
    }
  }

}
