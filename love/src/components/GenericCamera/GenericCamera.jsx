import React, { useEffect } from 'react';

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
                console.log('reading', count, done);
                // When no more data needs to be consumed, close the stream
                if (count > 2) {
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
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          /**
          
          # https://github.com/lsst-ts/ts_GenericCamera/blob/3eb5d5e104413cecb7950e2880a1154ea9846482/python/lsst/ts/GenericCamera/liveview/liveview.py#L277

          read_bytes = await self.reader.readline()

          if read_bytes.rstrip().endswith(b'[START]'):

              self.log.debug(f"Image started... Got {read_bytes}")

              read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
              width = int(read_bytes.decode().rstrip())

              read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
              height = int(read_bytes.decode().rstrip())

              read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
              isJPEG = bool(int(read_bytes.decode().rstrip()))

              read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
              length = int(read_bytes.decode().rstrip())

              read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
              buffer = read_bytes

              while len(buffer) < length:
                  read_bytes = await asyncio.wait_for(self.reader.readline(), timeout=2.)
                  buffer += read_bytes

              dtype = np.uint8 if isJPEG else np.uint16

              return exposure.Exposure(np.frombuffer(buffer.rstrip()[:-5], dtype=dtype),
                                       width, height, {}, isJPEG)

           */
          const decoder = new TextDecoder('utf-8');
          const encoder = new TextEncoder('utf-8');

          const arrayBuffer = event.target.result;
          
          let headerCandidate = new Uint8Array(arrayBuffer.slice(0,50));
          const decoded = decoder.decode(headerCandidate);
          const split = decoded.split('\r\n');
          const START = split[0];
          const widthString = split[1];
          const heightString = split[2];
          const isPNGString = split[3];
          const lengthString = split[4];
          const matrixStartPosition = decoded.search(`${lengthString}\r\n`) + `${lengthString}\r\n`.length;
          const headerString = decoded.slice(0, matrixStartPosition);

          const headerByteCount = encoder.encode(headerString).length;

          const newHeader = decoder.decode(new Uint8Array(arrayBuffer.slice(0,headerByteCount)));
          const newHeaderPlusONe = decoder.decode(new Uint8Array(arrayBuffer.slice(0,headerByteCount+1)))          

          console.log('decoded', decoded)
          console.log('newHeader', newHeader);
          console.log('newHeaderPlusONe', newHeaderPlusONe);
          debugger;
        };

        fileReader.readAsArrayBuffer(blob);

        return URL.createObjectURL(blob);
      })
      .then((url) => console.log(url))
      .catch((err) => console.error(err));
  }, []);
  return <div>adsfsaf</div>;
}