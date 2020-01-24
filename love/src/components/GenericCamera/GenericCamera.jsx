import React, { useEffect, useRef, useState } from 'react';
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
  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(1024);
  const [containerWidth, setContainerWidth] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  const canvasRef = useRef(null);
  useEffect(() => {
    /** Start the stream once and update image size on every receive */
    const controller = new AbortController();
    const signal = controller.signal;
    CameraUtils.fetchImageFromStream((image) => {
      if (canvasRef.current) {
        CameraUtils.draw(new Uint8Array(image.body), canvasRef.current);

        setImageWidth(image.width);
        setImageHeight(image.height);
      }
    }, signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    /** Listen to size changes of the canvas parent element*/
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const container = entries[0];
      setContainerWidth(container.contentRect.width);
      setContainerHeight(container.contentRect.height);
    });

    observer.observe(canvasRef.current.parentNode);

    return ()=>{
      observer.disconnect();
    }
  }, []);

  useEffect(() => {
    /** Sync canvas size with its container and stream  */
    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    if (containerAspectRatio <= imageAspectRatio) {
      // image width does not fit container
      canvasRef.current.style.width = `${containerWidth}px`;
      canvasRef.current.style.height = `${containerWidth / imageAspectRatio}px`;
    } else {
      // image height does not fit in container
      canvasRef.current.style.height = `${containerHeight}px`;
      canvasRef.current.style.width = `${containerHeight * imageAspectRatio}px`;
    }

    /**
     * previous block is equivalent to:
     * width = Math.min( containerWidth, imageAspectRatio * containerHeight );
     * height = Math.min(containerHeight, 1/imageAspectRatio * containerWidth);
     * but this might be less readable
     */
    //
  }, [imageWidth, imageHeight, containerWidth, containerHeight]);

  return <canvas ref={canvasRef}></canvas>;
}
