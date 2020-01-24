const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

/**
 * Receives an ArrayBuffer (from the FileReader for example) and
 * returns the image information (width,height, isJPEG, length, body)
 * where body is the actual width \times height array
 * @param {ArrayBuffer} arrayBuffer
 */
export const getHeaderInfo = (arrayBuffer) => {
  // find the [START] in the string-decoded array
  // debugger;

  const decodedArray = decoder.decode(arrayBuffer);
  const sections = decodedArray.split('[END]\r\n').filter((s) => s.startsWith('[START]'));
  const exposure = sections[0];
  // const remainder = sections.slice(1).join('');

  const [START, widthString, heightString, isJPEGString, lengthString, ...buffer] = exposure.split('\r\n');
  // const encodedBuffer =  encoder.encode(buffer.join(''));
  // const encodedBuffer =  encoder.encode(buffer);
  const encodedBuffer = new Uint8Array(arrayBuffer.slice(33, 33 + 1024 * 1024));
  const remainder = new Uint8Array(arrayBuffer.slice(33 + 1024 * 1024 + 7));
  return {
    decodedArray: decodedArray,
    exposure: exposure,
    remainder: remainder,
    _START: START,
    width: parseInt(widthString),
    height: parseInt(heightString),
    isJPEG: isJPEGString === '1',
    length: parseInt(lengthString),
    body: encodedBuffer,
  };
};

/**
 * Paints gray pixels with values from array in a canvas.
 * array length must be canvas.width \times canvas.height
 * @param {array like} array
 * @param {HTMLCanvasElement} canvas
 */
export const draw = (array, canvas) => {
  var ctx = canvas.getContext('2d');

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // const data = new Uint8ClampedArray([...array].flatMap(v => [v,v,v, 255]));
  // const imageData = new ImageData(data, 1024, 1024);
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  var pixels = imageData.data;

  array.forEach((val, index) => {
    pixels[index * 4] = val;
    pixels[index * 4 + 1] = val;
    pixels[index * 4 + 2] = val;
    pixels[index * 4 + 3] = val;
  });

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Returns a blob containing the chunks where a whole image lives
 * i.e., it has at least one [START]...[END] block when decoded.
 * @param {ReadableStreamDefaultReader} reader
 */
export const readNextBlobFromStream = (reader, remainder) => {
  const stream = new ReadableStream({
    start(controller) {
      // first load the remainder from previous chunk
      let fullDecodedBuffer = decoder.decode(remainder);
      controller.enqueue(remainder);

      return pump();
      function pump() {
        return reader.read().then(({ done, value }) => {
          // Close it if stream closes too
          if (done) {
            controller.close();
            return;
          }

          // build up "buffer" string
          const decodedBuffer = decoder.decode(value);
          fullDecodedBuffer = fullDecodedBuffer + decodedBuffer;

          // check for START
          const startIndex = fullDecodedBuffer.indexOf('[START]\r\n');
          if (startIndex === -1) {
            controller.enqueue(value);
            return pump();
          }

          // check for END
          const endIndex = fullDecodedBuffer.slice(startIndex).indexOf('[END]\r\n');
          if (endIndex === -1) {
            controller.enqueue(value);
            return pump();
          }

          // if both START and END arrived, close

          controller.enqueue(value);
          controller.close();
        });
      }
    },
  });

  return new Response(stream).blob();
};

/**
 * Takes a Blob and attempts to get an image and its metadata
 * @param {Blob} blob
 */
export const readImageDataFromBlob = (blob) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onloadend = (event) => {
      const arrayBuffer = event.target.result;

      const headerInfo = getHeaderInfo(arrayBuffer);

      resolve(headerInfo);
    };

    fileReader.readAsArrayBuffer(blob);
  });
};

/**
 * Connects to the Generic Camera server with fetch and attempts
 * to draw images in a canvas from that stream.
 * @param {function} callback
 */
export const fetchImageFromStream = (callback, signal) => {
  return fetch('http://localhost/gencam', { signal }).then(async (r) => {
    const reader = r.body.getReader();

    let remainder = new Uint8Array([]);

    const animate = async () => {
      const blob = await readNextBlobFromStream(reader, remainder);

      const imageDataFromBlob = await readImageDataFromBlob(blob);
      // debugger;
      remainder = imageDataFromBlob.remainder;
      callback(imageDataFromBlob);
      requestAnimationFrame(animate);
    };
    animate();
  });
};
