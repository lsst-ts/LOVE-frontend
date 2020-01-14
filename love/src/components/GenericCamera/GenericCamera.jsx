import React, { useEffect } from 'react';
const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

const getHeaderInfo = (arrayBuffer) => {
  let headerCandidate = new Uint8Array(arrayBuffer.slice(0, 50));
  const footerCandidate = new Uint8Array(arrayBuffer.slice(arrayBuffer.byteLength - 100, arrayBuffer.byteLength - 1));
  const decoded = decoder.decode(headerCandidate);
  const split = decoded.split('\r\n');
  const START = split[0];
  const widthString = split[1];
  const heightString = split[2];
  const isPNGString = split[3];
  const lengthString = split[4];
  const matrixStartPosition = decoded.search(`${lengthString}\r\n`) + `${lengthString}\r\n`.length;
  const headerString = decoded.slice(0, matrixStartPosition);

  const headerByteLength = encoder.encode(headerString).length;
  const ENDLabelPosition = decoder.decode(arrayBuffer).indexOf('[END]\r\n');

  const body = arrayBuffer.slice(headerByteLength, headerByteLength + 1024 * 1024);

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

const bufferIncludesString = (buffer, string) => {
  return decoder.decode(buffer).includes(string);
};

const draw = (array, canvas) => {
  var ctx = canvas.getContext('2d');
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  var pixels = id.data;

  array.forEach((val, index) => {
    // if (index % 50 === 0) console.log(index,val);
    pixels[index * 4] = val;
    pixels[index * 4 + 1] = val;
    pixels[index * 4 + 2] = val;
    pixels[index * 4 + 3] = 255;
  });

  ctx.putImageData(id, 0, 0);
};

const readNextBlobFromStream = (reader, name) => {
  let streamHasStart = false;
  let streamHasEnd = false;

  const stream = new ReadableStream({
    start(controller) {
      return pump();
      function pump() {
        return reader.read().then(({ done, value }) => {
          // save new label found in this chunk
          console.log(name, 'reading');
          if (bufferIncludesString(value, '[START]')) {
            streamHasStart = true;
            console.log(name, 'streamHasStart');
          }
          if (bufferIncludesString(value, '[END]')) {
            streamHasEnd = true;
            console.log(name, 'streamHasEnd');
          }

          // Wait for a chunk with START before enqueueing
          if (!streamHasStart) {
            return;
          }
          console.log(name, 'enqueing');
          controller.enqueue(value);

          // If chunk includes END close the stream
          if (streamHasEnd) {
            console.log(name, 'closing')
            controller.close();
            return;
          }
          return pump();
        });
      }
    },
  });

  return new Response(stream).blob();
};

const readImageDataFromBlob = (blob, name) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    console.log(name, 'will read file');

    fileReader.onloadend = (event) => {
      const arrayBuffer = event.target.result;
      
      console.log(name, 'getting header');
      const headerInfo = getHeaderInfo(arrayBuffer);
      console.log(name, 'got header');
      resolve(headerInfo);
    };

    fileReader.readAsArrayBuffer(blob);
  });
};
/**
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */

const fetchImageFromStream = (name) => {
  console.log(name, 'starting to fetch');
  return fetch('http://localhost/gencam')
    .then(async (r) => {
      const reader = r.body.getReader();

      const blob = await readNextBlobFromStream(reader, name);

      return blob;
    })
    .then((blob) => readImageDataFromBlob(blob, name));
};
export default function() {
  let counter = 0;
  const animate = async () => {
    counter += 1;
    console.log('\n\n\n', counter, 'animate');
    const canvas = document.getElementById('canvas');
    const image = await fetchImageFromStream(counter);
    draw(new Uint8Array(image.body), canvas);
    window.animate = animate;
    // requestAnimationFrame(animate);
  };
  useEffect(() => {
    animate();
  }, []);
  return <canvas id="canvas" width="1024" height="1024"></canvas>;
}
