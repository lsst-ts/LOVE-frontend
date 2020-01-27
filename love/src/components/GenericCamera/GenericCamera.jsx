import React, { useEffect, useRef, useState } from 'react';
import * as CameraUtils from './CameraUtils';
import styles from './GenericCamera.module.css';

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
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const canvasRef = useRef(null);
  useEffect(() => {
    /** Start the stream once and update image size on every receive
     *  Retry if connection fails
     */
    const controller = new AbortController();
    const signal = controller.signal;
    let retryTimeout;
    const fetchAndRetry = () => {
      CameraUtils.fetchImageFromStream((image) => {
        if (canvasRef.current) {
          setImageWidth(image.width);
          setImageHeight(image.height);
          canvasRef.current.width = image.width;
          canvasRef.current.height = image.height;
          CameraUtils.draw(image.body, canvasRef.current);
        }
      }, signal).catch((error) => {
        if(retryTimeout !== undefined) clearTimeout(retryTimeout);
        setError(error);
        retryTimeout = setTimeout(()=>{
          setRetryCount(c=>c+1);
          fetchAndRetry();
        }, 3000);
      });
    };

    fetchAndRetry();

    return () => {
      controller.abort();
      clearTimeout(retryTimeout);
    };
  }, []);

  useEffect(() => {
    /** Listen to size changes of the canvas parent element*/
    if (!canvasRef.current) return;
    if(error !== undefined) return;
    const observer = new ResizeObserver((entries) => {
      const container = entries[0];
      setContainerWidth(container.contentRect.width);
      setContainerHeight(container.contentRect.height);
    });

    observer.observe(canvasRef.current.parentNode);

    return () => {
      observer.disconnect();
    };
  }, [error]);

  useEffect(() => {
    /** Sync canvas size with its container and stream  */
    if(error !== undefined) return;
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
  }, [imageWidth, imageHeight, containerWidth, containerHeight, error]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{`ERROR: ${error.message}`}</p>
        <span>Retrying {`(${retryCount})` }  </span>
      </div>
    );
  }
  return <canvas ref={canvasRef}></canvas>;
}
