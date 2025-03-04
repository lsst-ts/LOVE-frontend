/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/GeneralPurpose/Input/Input';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import HealpixOverlay from './HealpixOverlay';
import TargetLayer from './TargetLayer';
import StartStopLiveViewButton from './StartStopLiveViewButton/StartStopLiveViewButton';
import * as CameraUtils from './CameraUtils';
import styles from './GenericCameraControls.module.css';

const DEFAULT_URL = 'http://localhost/gencam';

/**
 * Draws a canvas in grayscale representing colors coming from
 * the Generic Camera images
 */
export default function GenericCameraControls({
  feedKey = 'generic',
  camFeeds = null,
  salindex = 1,
  subscribeToStreams = () => {},
  unsubscribeToStreams = () => {},
  requestSALCommand = () => {},
  summaryStateData = undefined,
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
  const [summaryState, setSummaryState] = useState(0);

  // const canvasRef = useRef(null);
  const [canvasRef, setCanvasRef] = useState(null);

  const checkStateForControls = () => {
    return summaryState !== 2;
  };

  const updateExposureTime = (value) => {
    const numVal = parseFloat(value);
    changeExposureTime(numVal);
  };

  const runCommand = (isLatched) => {
    if (isLatched) {
      requestSALCommand({
        cmd: 'cmd_startLiveView',
        csc: 'GenericCamera',
        salindex,
        params: { expTime: exposureTime },
      });
    } else {
      setError(null);
      setInitialLoading(true);
      requestSALCommand({
        cmd: 'cmd_stopLiveView',
        csc: 'GenericCamera',
        salindex,
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
    subscribeToStreams(salindex);
    return () => {
      unsubscribeToStreams(salindex);
    };
  }, [salindex]);

  useEffect(() => {
    const currentState = summaryStateData ? summaryStateData.summaryState.value : 0;
    setSummaryState(currentState);
  }, [summaryStateData]);

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

  const imageAspectRatio = imageWidth / imageHeight;

  return (
    <div>
      <div className={styles.controlsContainer}>
        <StartStopLiveViewButton onChange={runCommand} disabled={checkStateForControls()} />
        <Input
          type="number"
          step="any"
          onChange={(e) => updateExposureTime(e.target.value)}
          value={exposureTime}
          disabled={checkStateForControls()}
        />
        <label>seconds</label>
      </div>
      <hr />
      {initialLoading ? (
        <div className={styles.errorContainer}>
          {runLiveView ? (
            <p>
              <SpinnerIcon className={styles.spinnerIcon} />
              Fetching stream from {feedUrl}, please wait.
            </p>
          ) : (
            <p>Live view not started</p>
          )}
        </div>
      ) : (
        <>
          {error ? (
            <div className={styles.errorContainer}>
              <p>{`ERROR: ${error.message}`}</p>
              <p>
                <SpinnerIcon className={styles.spinnerIcon} />
                Retrying {`(${retryCount})`}{' '}
              </p>
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
        </>
      )}
    </div>
  );
}

GenericCameraControls.propTypes = {
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
  salindex: PropTypes.number,

  /**
   * Function to subscribe to streams for state information
   */
  subscribeToStreams: PropTypes.func,

  /**
   * Function to unsubscribe from streams
   */
  unsubscribeToStreams: PropTypes.func,

  /**
   * Function that handles calling commands on the GenericCamera
   */
  requestSALCommand: PropTypes.func,

  /**
   * Topic data from SummaryState event
   */
  summaryStateData: PropTypes.object,

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
