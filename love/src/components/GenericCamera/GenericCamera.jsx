import React, { useEffect, useState } from 'react';
import * as CameraUtils from './CameraUtils';
import styles from './GenericCamera.module.css';

export const schema = {
  description: 'Renders the images streamed by the GenericCamera live view server into an HTML5 canvas',
  defaultSize: [10, 10],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Generic camera',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    serverURL: {
      type: 'string',
      description: 'URL of the live view server',
      isPrivate: false,
      default: '/gencam',
    },
  },
};

/**
 * Draws a canvas in grayscale representing colors coming from
 * the Generic Camera images
 */
export default function GenericCamera({ serverURL = schema.props.serverURL.default }) {
  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(1024);
  const [containerWidth, setContainerWidth] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  // const canvasRef = useRef(null);
  const [canvasRef, setCanvasRef] = useState(null);

  const onCanvasRefChange = React.useCallback(
    (canvasNode) => {
      setCanvasRef(canvasNode);
      /** Listen to size changes of the canvas parent element*/
      if (!canvasNode) return;
      if (error !== null) return;
      const observer = new ResizeObserver((entries) => {
        const container = entries[0];
        setContainerWidth(container.contentRect.width);
        setContainerHeight(container.contentRect.height);
      });

      observer.observe(canvasNode.parentNode);

      return () => {
        observer.disconnect();
      };
    },
    [error],
  );

  useEffect(() => {
    /** Start the stream once and update image size on every receive
     *  Retry if connection fails
     */

    let retryTimeout;

    const retryFetch = (error) => {
      if (retryTimeout !== undefined) clearTimeout(retryTimeout);
      setError(error);
      setInitialLoading(false);
      retryTimeout = setTimeout(() => {
        setRetryCount((c) => c + 1);
        fetchAndRetry();
      }, 3000);
    };

    const imageErrorCallback = (error) => {
      retryFetch(error);
    };

    const controller = new AbortController();
    const signal = controller.signal;
    const fetchAndRetry = () => {
      CameraUtils.fetchImageFromStream(
        serverURL,
        (image) => {
          setError(null);
          setInitialLoading(false);
          setRetryCount(0);
          if (canvasRef) {
            setImageWidth(image.width);
            setImageHeight(image.height);
            canvasRef.width = image.width;
            canvasRef.height = image.height;
            CameraUtils.draw(image.body, canvasRef);
          }
        },
        signal,
        imageErrorCallback,
      ).catch(retryFetch);
    };

    fetchAndRetry();

    return () => {
      controller.abort();
      clearTimeout(retryTimeout);
    };
  }, [serverURL, canvasRef]);


  useEffect(() => {
    /** Sync canvas size with its container and stream  */
    if (error !== null) return;
    if (initialLoading) return;
    if (!canvasRef) return;
    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    if (containerAspectRatio <= imageAspectRatio) {
      // image width does not fit container
      canvasRef.style.width = `${containerWidth}px`;
      canvasRef.style.height = `${containerWidth / imageAspectRatio}px`;
    } else {
      // image height does not fit in container
      canvasRef.style.height = `${containerHeight}px`;
      canvasRef.style.width = `${containerHeight * imageAspectRatio}px`;
    }

    /**
     * previous block is equivalent to:
     * width = Math.min( containerWidth, imageAspectRatio * containerHeight );
     * height = Math.min(containerHeight, 1/imageAspectRatio * containerWidth);
     * but this might be less readable
     */
    //
  }, [imageWidth, imageHeight, containerWidth, containerHeight, error, initialLoading, canvasRef]);

  if (error !== null) {
    return (
      <div className={styles.errorContainer}>
        <p>{`ERROR: ${error.message}`}</p>
        <span>Retrying {`(${retryCount})`} </span>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className={styles.errorContainer}>
        <p>Fetching stream from {serverURL}, please wait.</p>
      </div>
    );
  }

  return <canvas ref={onCanvasRefChange}></canvas>;
}
