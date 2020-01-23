import React, { useEffect } from 'react';
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

/**
 * Receives an ArrayBuffer (from the FileReader for example) and
 * returns the image information (width,height, isJPEG, length, body)
 * where body is the actual width \times height array
 * @param {ArrayBuffer} arrayBuffer
 */
const getHeaderInfo = (arrayBuffer) => {
  // find the [START] in the string-decoded array
  const decodedArray = decoder.decode(arrayBuffer);
  const sections = decodedArray.split('[END]\r\n').filter((s) => s.startsWith('[START]'));
  const exposure = sections[0];
  const remainder = sections.slice(1).join('');

  const [START, widthString, heightString, isJPEGString, lengthString, buffer] = exposure.split('\r\n');

  return {
    exposure: exposure,
    remainder: remainder,
    _START: START,
    width: parseInt(widthString),
    height: parseInt(heightString),
    isJPEG: isJPEGString === '1',
    length: parseInt(lengthString),
    body: encoder.encode(buffer),
  };
};

/**
 * Paints gray pixels with values from array in a canvas.
 * array length must be canvas.width \times canvas.height
 * @param {array like} array
 * @param {HTMLCanvasElement} canvas
 */
const draw = (array, canvas) => {
  var ctx = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  var pixels = id.data;

  array.forEach((val, index) => {
    pixels[index * 4] = val;
    pixels[index * 4 + 1] = val;
    pixels[index * 4 + 2] = val;
    pixels[index * 4 + 3] = 255;
  });

  ctx.putImageData(id, 0, 0);
};

/**
 * Returns a blob containing the chunks where a whole image lives
 * i.e., it has at least one [START]...[END] block when decoded.
 * @param {ReadableStreamDefaultReader} reader
 */
const readNextBlobFromStream = (reader, remainder) => {
  const stream = new ReadableStream({
    start(controller) {
      // first load the remainder from previous chunk
      let fullDecodedBuffer = remainder;
      controller.enqueue(encoder.encode(remainder));

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
const readImageDataFromBlob = (blob) => {
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
const fetchImageFromStream = (callback, signal) => {
  return fetch('http://localhost/gencam', { signal }).then(async (r) => {
    const reader = r.body.getReader();

    let remainder = '';

    const animate = async () => {
      const blob = await readNextBlobFromStream(reader, remainder);

      const imageDataFromBlob = await readImageDataFromBlob(blob);
      remainder = imageDataFromBlob.remainder;
      callback(imageDataFromBlob);
      requestAnimationFrame(animate);
    };
    animate();
  });
};

/**
 * Draws a canvas in grayscale representing colors coming from
 * the Generic Camera images
 */
export default function() {
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const controller = new AbortController();
    const signal = controller.signal;
    fetchImageFromStream((image) => {
      draw(new Uint8Array(image.body), canvas);
    }, signal);

    return () => {
      controller.abort();
    };
  }, []);
  return <canvas id="canvas" width="1024" height="1024"></canvas>;
}
