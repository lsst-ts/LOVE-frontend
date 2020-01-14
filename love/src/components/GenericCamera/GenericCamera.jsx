import React, { useEffect } from 'react';
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

const bufferIncludesString = (buffer, string) => {
  return decoder.decode(buffer).includes(string);
};

const bufferIndexOfString = (buffer, string) => {
  return decoder.decode(buffer).indexOf(string);
};

const getHeaderInfo = (arrayBuffer) => {
  console.log(arrayBuffer);

  // find the [START] in the string-decoded array
  const START_STRING = '[START]\r\n';
  const decodedArray = decoder.decode(arrayBuffer);
  const startIndex = decodedArray.indexOf(START_STRING);
  const reEncodedFromStart = encoder.encode(decodedArray.slice(startIndex, startIndex + decodedArray.length - 1));
  const headerCandidate = decodedArray.slice(startIndex, startIndex + 50);

  console.log('startIndex', startIndex);

  // const headerStartPosition = startIndex;
  // // Get chunk header string
  // // const headerStartPosition = decodedArray.indexOf('[START]\r\n') + '[START]\r\n'.length ;
  // let headerCandidate = new Uint8Array(arrayBuffer.slice(headerStartPosition, headerStartPosition + 50));
  const decoded = headerCandidate;
  console.log('decoded\n', decoded);

  // extract header data
  const split = decoded.split('\r\n');
  const START = split[0];
  const widthString = split[1];
  const heightString = split[2];
  const isPNGString = split[3];
  const lengthString = split[4];
  const matrixStartPosition = decoded.search(`${lengthString}\r\n`) + `${lengthString}\r\n`.length;
  const headerString = decoded.slice(0, matrixStartPosition);


  const headerByteLength = encoder.encode(headerString).length;
  // const body = arrayBuffer.slice(headerByteLength, headerByteLength + 1024 * 1024);
  const body = encoder.encode(decodedArray.slice(headerString.length)).slice(0, 1024 * 1024);
  console.log(body);

  // const ENDLabelPosition = decoder.decode(arrayBuffer).indexOf('[END]\r\n');
  // const { headerByteLength, length, body } = headerInfo;

  // const newHeader = decoder.decode(new Uint8Array(arrayBuffer.slice(0, headerByteLength)));
  // const newHeaderPlusONe = decoder.decode(new Uint8Array(arrayBuffer.slice(0, headerByteLength + 1)));

  return {
    headerByteLength,
    _decoded: decoded,
    _START: START,
    width: parseInt(widthString),
    height: parseInt(heightString),
    isPNG: isPNGString === '1',
    length: parseInt(lengthString),
    body: body,
  };
};

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

const readNextBlobFromStream = (reader, name) => {

  const stream = new ReadableStream({
    start(controller) {
      let fullDecodedBuffer = '';
      let gotStart = false;
      return pump();
      function pump() {
        return reader.read().then(({ done, value }) => {
          // save new label found in this chunk
          // console.log(name, 'new chunk');

          const decodedBuffer = decoder.decode(value);
          fullDecodedBuffer = fullDecodedBuffer + decodedBuffer;

          const startIndex = fullDecodedBuffer.indexOf('[START]\r\n');
          if (startIndex === -1) {
            controller.enqueue(value);
            return pump();
          }

          const endIndex = fullDecodedBuffer.slice(startIndex).indexOf('[END]\r\n');
          console.log('\nendIndex', endIndex);
          if (endIndex === -1) {
            controller.enqueue(value);
            return pump();
          }
          console.log('closing');

          controller.enqueue(value);
          controller.close();
        });
      }
    },
  });

  return new Response(stream).blob();
};

const readImageDataFromBlob = (blob, name) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    // console.log(name, 'will read file');

    fileReader.onloadend = (event) => {
      const arrayBuffer = event.target.result;

      // console.log(name, 'getting header');
      const headerInfo = getHeaderInfo(arrayBuffer);
      // console.log(name, 'got header');
      console.log(headerInfo);
      resolve(headerInfo);
    };

    fileReader.readAsArrayBuffer(blob);
  });
};
/**
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */

const fetchImageFromStream = (callback) => {
  // console.log( 'starting to fetch');
  return fetch('http://localhost/gencam').then(async (r) => {
    const reader = r.body.getReader();
    let count = 0;

    const animate = async () => {
      if (count > 5) return;
      count++;

      const blob = await readNextBlobFromStream(reader, count);

      const imageDataFromBlob = await readImageDataFromBlob(blob, count);
      callback(imageDataFromBlob);
      requestAnimationFrame(animate);
    };
    animate();
  });
};
export default function() {
  useEffect(() => {
    const canvas = document.getElementById('canvas');

    fetchImageFromStream((image) => {
      draw(new Uint8Array(image.body), canvas);
    });
  }, []);
  return <canvas id="canvas" width="1024" height="1024"></canvas>;
}
