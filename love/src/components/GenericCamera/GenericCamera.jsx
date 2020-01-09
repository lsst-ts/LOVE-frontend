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
                if (count > 3) {
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

          const arrayBuffer = event.target.result;
          let arr = [...new Float64Array(arrayBuffer)];
          
          debugger;
        };

        fileReader.readAsArrayBuffer(blob);

        URL.createObjectURL(blob);
      })
      .then((url) => console.log(url))
      .catch((err) => console.error(err));
  }, []);
  return <div>adsfsaf</div>;
}
