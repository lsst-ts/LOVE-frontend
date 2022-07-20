import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as CameraUtils from './CameraUtils';
import styles from './GenericCamera.module.css';
import HealpixOverlay from './HealpixOverlay';
import TargetLayer from './TargetLayer';
import StartStopLiveViewButton from './StartStopLiveViewButton/StartStopLiveViewButton';
import NumericInput from '../GeneralPurpose/Input/NumericInput';

const DEFAULT_URL = 'http://localhost/gencam';

/**
 * Draws a canvas in grayscale representing colors coming from
 * the Generic Camera images
 */
export default function GenericCamera({
  feedKey,
  camFeeds,
  salIndex,
  requestSALCommand,
  healpixOverlays = [],
  selectedCell = undefined,
  onLayerClick = () => {},
  targetOverlay = {},
}) {
  const feedUrl = camFeeds && feedKey in camFeeds ? camFeeds[feedKey] : DEFAULT_URL;
  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(1024);
  const [containerWidth, setContainerWidth] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [runLiveView, setRunLiveView] = useState(false);
  const [exposureTime, changeExposureTime] = useState(5);

  // const canvasRef = useRef(null);
  const [canvasRef, setCanvasRef] = useState(null);

  const updateExposureTime = (value) => {
    const numVal = parseFloat(value);
    changeExposureTime(numVal);
  };

  const runCommand = (isLatched) => {
    if (isLatched) {
      requestSALCommand({
        cmd: 'cmd_startLiveView',
        csc: 'GenericCamera',
        salindex: salIndex,
        params: { expTime: exposureTime },
      });
    } else {
      setError(null);
      setInitialLoading(true);
      requestSALCommand({
        cmd: 'cmd_stopLiveView',
        csc: 'GenericCamera',
        salindex: salIndex,
        params: {},
      });
    }
    setRunLiveView(isLatched);
  };

  const onCanvasRefChange = React.useCallback(
    (canvasNode) => {
      setCanvasRef(canvasNode);
      /** Listen to size changes of the canvas parent element */
      if (!canvasNode) return undefined;
      if (error !== null) return undefined;
      if (!runLiveView) return undefined;
      console.log('Canvas ref change');
      const observer = new ResizeObserver((entries) => {
        const container = entries[0];
        setContainerWidth(container.contentRect.width);
        setContainerHeight(container.contentRect.height);
      });

      observer.observe(canvasNode.parentNode.parentNode);

      return () => {
        observer.disconnect();
      };
    },
    [runLiveView],
  );

  useEffect(() => {
    /** Start the stream once and update image size on every receive
     *  Retry if connection fails
     */
    if (!runLiveView) return undefined;
    let retryTimeout;

    const retryFetch = (e) => {
      if (retryTimeout !== undefined) clearTimeout(retryTimeout);
      setError(e);
      setInitialLoading(false);
      retryTimeout = setTimeout(() => {
        setRetryCount((c) => c + 1);
        fetchAndRetry();
      }, 3000);
    };

    const imageErrorCallback = (e) => {
      retryFetch(e);
    };

    const controller = new AbortController();
    const { signal } = controller;
    const fetchAndRetry = () => {
      console.log('Fetch stream');
      CameraUtils.fetchImageFromStream(
        feedUrl,
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
  }, [feedUrl, canvasRef, runLiveView]);

  useEffect(() => {
    /** Sync canvas size with its container and stream  */
    if (error !== null) return;
    if (initialLoading) return;
    if (initialLoading) return;
    if (!canvasRef) return;
    console.log('Sync canvas, container and stream');
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

  // if (error !== null) {
  //   return (
  //     <div className={styles.errorContainer}>
  //       <p>Fetching stream from {feedUrl}, please wait.</p>
  //       <p>{`ERROR: ${error.message}`}</p>
  //       <span>Retrying {`(${retryCount})`} </span>
  //     </div>
  //   );
  // }

  // if (initialLoading) {
  //   return (
  //     <div className={styles.errorContainer}>
  //       <p>Fetching stream from {feedUrl}, please wait.</p>
  //     </div>
  //   );
  // }

  const imageAspectRatio = imageWidth / imageHeight;

  return (
    <div>
      <div className={styles.controlsContainer}>
        <StartStopLiveViewButton onChange={runCommand} />
        <NumericInput step="any" onChange={(e) => updateExposureTime(e.target.value)} value={exposureTime} />
        <label>seconds</label>
      </div>
      <hr />
      {initialLoading ? (
        <div className={styles.errorContainer}>
          {runLiveView ? <p>Fetching stream from {feedUrl}, please wait.</p> : <p>Live view not started</p>}
        </div>
      ) : (
        <div className={styles.cameraContainer}>
          {healpixOverlays.map((overlay, index) => {
            return (
              overlay.display && (
                <HealpixOverlay
                  key={index}
                  width={Math.min(containerWidth, imageAspectRatio * containerHeight)}
                  height={Math.min(containerHeight, (1 / imageAspectRatio) * containerWidth)}
                  selectedCell={selectedCell}
                  {...overlay}
                  onLayerClick={onLayerClick}
                ></HealpixOverlay>
              )
            );
          })}
          {targetOverlay?.data?.length > 0 && targetOverlay?.display && (
            <TargetLayer
              width={Math.min(containerWidth, imageAspectRatio * containerHeight)}
              height={Math.min(containerHeight, (1 / imageAspectRatio) * containerWidth)}
              onLayerClick={onLayerClick}
              selectedCell={selectedCell}
              {...targetOverlay}
            ></TargetLayer>
          )}
          <canvas ref={onCanvasRefChange}></canvas>
        </div>
      )}
    </div>
  );
}

GenericCamera.propTypes = {
  /**
   * Name to identify the live view server
   */
  feedKey: PropTypes.string,

  /**
   * Dictionary of live feed URLs
   */
  camFeeds: PropTypes.object,

  /**
   * Index of the GenericCamera to control
   */
  salIndex: PropTypes.number,

  /**
   * Function that handles calling commands on the GenericCamera
   */
  requestSALCommand: PropTypes.func,
  /**
   * List of objects describing the healpix layers
   */
  healpixOverlays: PropTypes.array,

  /**
   * Object describing the selected cell
   */
  selectedCell: PropTypes.object,

  /**
   * Callback to run when clicking on a layer
   */
  onLayerClick: PropTypes.func,

  /**
   * Object describing the target layer of click events
   */
  targetOverlay: PropTypes.object,
};

GenericCamera.defaultProps = {
  feedKey: 'generic',
  camFeeds: null,
  salIndex: 1,
  requestSALCommand: () => 0,
};
