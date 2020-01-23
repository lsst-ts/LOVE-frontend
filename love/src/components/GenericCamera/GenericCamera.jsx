import React, { useEffect, useRef } from 'react';
import * as CameraUtils from './CameraUtils';

export const schema = {
  description: 'Renders the exposures streamed by the GenericCamera live view server into an HTML5 canvas',
  defaultSize: [10, 10],
  props: {}
};
/**
 * Draws a canvas in grayscale representing colors coming from
 * the Generic Camera images
 */
export default function() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    CameraUtils.fetchImageFromStream((image) => {
      if (canvasRef.current) {
        canvasRef.current.width = image.width;
        canvasRef.current.height = image.height;
        CameraUtils.draw(new Uint8Array(image.body), canvasRef.current);
      }
    }, signal);

    return () => {
      controller.abort();
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}
