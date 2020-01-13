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

/**
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
 */
export default function() {
  useEffect(() => {
    console.log('did mount');
    fetch('http://localhost/gencam')
      .then((r) => {
        return r.body;
      })
      .then((r) => {
        const reader = r.getReader();
        let count = 0;
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                count = count + 1;
                // console.log('\nSTART?:', bufferIncludesString(value, 'START'))
                // console.log('END?', bufferIncludesString(value, 'END'))
                // When no more data needs to be consumed, close the stream
                if (count > 3) {
                  controller.enqueue(value);
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
        console.log(r.getReader());
      })
      .then((stream) => {
        console.log('got stream');
        return new Response(stream);
      })
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();

          fileReader.onloadend = (event) => {
            const arrayBuffer = event.target.result;
            console.log(arrayBuffer);
            const headerInfo = getHeaderInfo(arrayBuffer);
            const { headerByteLength, length, body } = headerInfo;

            const newHeader = decoder.decode(new Uint8Array(arrayBuffer.slice(0, headerByteLength)));
            const newHeaderPlusONe = decoder.decode(new Uint8Array(arrayBuffer.slice(0, headerByteLength + 1)));
            resolve(headerInfo);
          };

          fileReader.readAsArrayBuffer(blob);
        });

      })
      .then((r) => {
        console.log(r);

      })
      .catch((err) => console.error(err));
  }, []);
  return <div><img id="photo"></img></div>;
}
