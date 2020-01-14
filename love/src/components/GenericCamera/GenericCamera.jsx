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

/**
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */
export default function() {
  useEffect(() => {
    fetch('http://localhost/gencam')
      .then((r) => {
        const reader = r.body.getReader();
        let streamHasStart = false;
        let streamHasEnd = false;
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // save new label found in this chunk
                if (bufferIncludesString(value, '[START]')) {
                  streamHasStart = true;
                }
                if (bufferIncludesString(value, '[END]')) {
                  streamHasEnd = true;
                }

                // Wait for a chunk with START before enqueueing 
                if (!streamHasStart) {
                  return;
                }
                controller.enqueue(value);

                // If chunk includes END close the stream  
                if (streamHasEnd) {
                  controller.close();
                  return;
                }
                return pump();
              });
            }
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();

          fileReader.onloadend = (event) => {
            const arrayBuffer = event.target.result;
            const headerInfo = getHeaderInfo(arrayBuffer);
            resolve(headerInfo);
          };

          fileReader.readAsArrayBuffer(blob);
        });
      })
      .then((r) => {
        console.log('r',r);
        const canvas = document.getElementById('canvas');
        draw(new Uint8Array(r.body), canvas);
      })
      .catch((err) => console.error(err));
  }, []);
  return <canvas id="canvas" width="1024" height="1024"></canvas>;
}
