import { FileData } from '../_models/fileData';

/**
 * Resize an image
 * @param _canvas an HTMLCanvasElement
 * @param data contains File, dataUrl and optionnal arrayBuffer (not implanted) objects
 * @param ratio
 */
export function reduceImageSize(_canvas: HTMLCanvasElement, data: FileData, ratio: number, callback: Function): void {
  // if (data.imageReducerIterations && data.imageReducerIterations >= 3) { return; }
  const image = new Image();
  image.src = data.dataUrl;
  image.onload = function() {
    const canvas = _canvas;

    image.width = image.width * ratio;
    image.height = image.height * ratio;

    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    // create new dataUrl and File object
    // (new File obj just for updating file.size)
    const dataUrl = canvas.toDataURL(data.file.type);

    if (!data.imageReducerIterations) { data.imageReducerIterations = 1; } else {
      data.imageReducerIterations = data.imageReducerIterations + 1;
    }
    data.initialFileSize = data.initialFileSize ? data.initialFileSize : data.file.size;
    const nf = new File([dataUrl], data.file.name, {type: data.file.type, lastModified: data.file.lastModified});
    data.file = nf;
    data.dataUrl = dataUrl;

    if (callback) { callback(); }
  };
}

/**
 * Rotate an image
 * @param _canvas an HTMLCanvasElement
 * @param data contains File, ArrayBuffer and DataUrl objects
 * @param direction left or right
 */
export function rotateImage(_canvas: HTMLCanvasElement, data: FileData, direction: 'left' | 'right'): void {
  let tx = 0, ty = 0;
  let rad: number;
  const canvas = _canvas;
  const context: CanvasRenderingContext2D = canvas.getContext('2d');
  const image = new Image();
  image.src = data.dataUrl;

  image.onload = function() {
    switch (direction) {
      case 'right':
        tx = image.height;
        rad = Math.PI / 2;
        break;
      case 'left':
        ty = image.width;
        rad = -Math.PI / 2;
        break;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    canvas.style.width = image.height + 'px';
    canvas.style.height = image.width + 'px';
    canvas.height = image.width;
    canvas.width = image.height;
    context.translate(tx, ty);
    context.rotate(rad);
    context.drawImage(image, 0, 0, image.width, image.height);
    context.restore();

    const dataUrl = canvas.toDataURL(data.file.type, 0.8);
    const idat = context.getImageData(0, 0, image.width, image.height);
    // const arrayBuffer = idat.data.buffer;

    // data.arrayBuffer = arrayBuffer;
    data.dataUrl = dataUrl;
    data.file = new File([dataUrl], data.file.name, {type: data.file.type, lastModified: data.file.lastModified});
  };
}


