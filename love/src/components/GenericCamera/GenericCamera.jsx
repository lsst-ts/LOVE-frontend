import React, { useEffect, useRef } from 'react';
import * as CameraUtils from './CameraUtils';

export const schema = {
  description: 'Renders the exposures streamed by the GenericCamera live view server into an HTML5 canvas',
  defaultSize: [10, 10],
  props: {},
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

        const containerWidth = parseInt(canvasRef.current.parentNode.style.width.slice(0, -2));
        const containerHeight = parseInt(canvasRef.current.parentNode.style.height.slice(0, -2));
        const imageAspectRatio = image.width / image.height;

        if (containerWidth / containerHeight <= imageAspectRatio) {
          // image width does not fit container
          canvasRef.current.style.width = `${containerWidth}px`;
          canvasRef.current.style.height = `${containerWidth / imageAspectRatio}px`;
        } else {
          // image height does not fit in container
          canvasRef.current.style.height = `${containerHeight}px`;
          canvasRef.current.style.width = `${containerHeight * imageAspectRatio}px`;
        }
      }
    }, signal);

    return () => {
      controller.abort();
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}
