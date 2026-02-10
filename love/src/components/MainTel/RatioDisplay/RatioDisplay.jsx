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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './RatioDisplay.module.css';

function RatioDisplay({
  timeSeriesData = [],
  initialRatio = 0.6,
  outerLabel = 'Outer',
  innerLabel = 'Inner',
  showControls = true,
  minRatio = 0.1,
  maxRatio = 0.95,
  autoPlay = false,
  playbackSpeed = 1000,
}) {
  const [ratio, setRatio] = useState(initialRatio);
  const [currentIndex, setCurrentIndex] = useState(timeSeriesData.length > 0 ? timeSeriesData.length - 1 : 0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Get current data point from time series
  const currentData = timeSeriesData[currentIndex] || { outerAzimuth: 0, innerAzimuth: 0, timestamp: null };
  const outerAzimuth = currentData.outerAzimuth;
  const innerAzimuth = currentData.innerAzimuth;

  // Calculate dimensions
  const outerSize = 300; // Fixed outer circle size in pixels
  const innerSize = outerSize * ratio;

  // Convert azimuth to rotation (azimuth 0 is North, clockwise)
  const getRotation = (azimuth) => azimuth;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && timeSeriesData.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= timeSeriesData.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, timeSeriesData.length, playbackSpeed]);

  // Update current index when new data arrives
  useEffect(() => {
    if (!isPlaying && timeSeriesData.length > 0) {
      setCurrentIndex(timeSeriesData.length - 1);
    }
  }, [timeSeriesData.length, isPlaying]);

  const handleTimeSliderChange = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const goToEnd = () => {
    setCurrentIndex(timeSeriesData.length - 1);
    setIsPlaying(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className={styles.container}>
      {showControls && (
        <div className={styles.controls}>
          <label className={styles.controlLabel}>
            Size Ratio: {ratio.toFixed(3)}
            <input
              type="range"
              min={minRatio}
              max={maxRatio}
              step="0.001"
              value={ratio}
              onChange={(e) => setRatio(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </label>
          <div className={styles.ratioValues}>
            <span>Min: {minRatio}</span>
            <span>Max: {maxRatio}</span>
          </div>
        </div>
      )}

      {/* Time Series Controls */}
      {timeSeriesData.length > 0 && (
        <div className={styles.timeControls}>
          <div className={styles.timeControlsHeader}>
            <span className={styles.timeLabel}>Time Series Navigation</span>
            <span className={styles.timeInfo}>
              {currentIndex + 1} / {timeSeriesData.length}
            </span>
          </div>

          <div className={styles.playbackControls}>
            <button onClick={goToStart} className={styles.controlButton} title="Go to start">
              ⏮
            </button>
            <button onClick={togglePlayback} className={styles.controlButton} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={goToEnd} className={styles.controlButton} title="Go to end">
              ⏭
            </button>
          </div>

          <div className={styles.timeSliderContainer}>
            <input
              type="range"
              min="0"
              max={timeSeriesData.length - 1}
              value={currentIndex}
              onChange={(e) => handleTimeSliderChange(parseInt(e.target.value))}
              className={styles.timeSlider}
              disabled={timeSeriesData.length === 0}
            />
          </div>

          {currentData.timestamp && <div className={styles.timestamp}>{formatTimestamp(currentData.timestamp)}</div>}
        </div>
      )}

      <div className={styles.displayArea}>
        <svg
          width={outerSize + 80}
          height={outerSize + 80}
          viewBox={`${-outerSize / 2 - 40} ${-outerSize / 2 - 40} ${outerSize + 80} ${outerSize + 80}`}
          className={styles.svg}
        >
          {/* Outer Circle - rotates with azimuth */}
          <g transform={`rotate(${getRotation(outerAzimuth)})`}>
            <circle cx="0" cy="0" r={outerSize / 2} className={styles.outerCircle} strokeWidth="2" />

            {/* Outer direction indicator - fixed mark on the circle */}
            <line
              x1="0"
              y1={-outerSize / 2}
              x2="0"
              y2={-outerSize / 2 + 20}
              className={styles.outerIndicator}
              strokeWidth="4"
            />
            <polygon points="0,-150 -10,-135 10,-135" className={styles.outerArrow} />
          </g>

          {/* Outer Label */}
          <text x="0" y={outerSize / 2 + 25} textAnchor="middle" className={styles.outerLabel}>
            {outerLabel}: {outerAzimuth.toFixed(2)}°
          </text>

          {/* Inner Rectangle - rotates with azimuth */}
          <g transform={`rotate(${getRotation(innerAzimuth)})`}>
            <rect
              x={-innerSize / 2}
              y={-innerSize / 2}
              width={innerSize}
              height={innerSize}
              className={styles.innerRect}
              strokeWidth="2"
            />

            {/* Inner direction indicator - fixed mark on the rectangle */}
            <line
              x1="0"
              y1={-innerSize / 2}
              x2="0"
              y2={-innerSize / 2 + 15}
              className={styles.innerIndicator}
              strokeWidth="3"
            />
            <polygon
              points={`0,${-innerSize / 2} -8,${-innerSize / 2 + 15} 8,${-innerSize / 2 + 15}`}
              className={styles.innerArrow}
            />

            {/* Devices attached to inner component - rotate with inner */}
            {/* Device 1 - Left side, upper */}
            <circle cx={-innerSize / 2} cy={-innerSize / 4} r="8" className={styles.device} />
            {/* Device 2 - Left side, lower */}
            <circle cx={-innerSize / 2} cy={innerSize / 4} r="8" className={styles.device} />
            {/* Device 3 - Right side, center */}
            <circle cx={innerSize / 2} cy="0" r="8" className={styles.device} />
          </g>

          {/* Inner Label */}
          <text x="0" y={innerSize / 2 + 15} textAnchor="middle" className={styles.innerLabel}>
            {innerLabel}: {innerAzimuth.toFixed(2)}°
          </text>

          {/* Cardinal Directions - fixed reference frame */}
          <text x="0" y={-outerSize / 2 - 8} textAnchor="middle" className={styles.cardinal}>
            N
          </text>
          <text x={outerSize / 2 + 8} y="5" textAnchor="start" className={styles.cardinal}>
            E
          </text>
          <text x="0" y={outerSize / 2 + 15} textAnchor="middle" className={styles.cardinal}>
            S
          </text>
          <text x={-outerSize / 2 - 8} y="5" textAnchor="end" className={styles.cardinal}>
            W
          </text>
        </svg>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{outerLabel} Azimuth:</span>
            <span className={styles.infoValue}>{outerAzimuth.toFixed(2)}°</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{innerLabel} Azimuth:</span>
            <span className={styles.infoValue}>{innerAzimuth.toFixed(2)}°</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Current Ratio:</span>
            <span className={styles.infoValue}>{ratio.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

RatioDisplay.propTypes = {
  /** Array of time series data points with structure: { timestamp: Date/string, outerAzimuth: number, innerAzimuth: number } */
  timeSeriesData: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
      outerAzimuth: PropTypes.number.isRequired,
      innerAzimuth: PropTypes.number.isRequired,
    }),
  ),
  /** Initial size ratio between inner and outer elements (0-1) */
  initialRatio: PropTypes.number,
  /** Label for outer circle */
  outerLabel: PropTypes.string,
  /** Label for inner rectangle */
  innerLabel: PropTypes.string,
  /** Show ratio adjustment controls */
  showControls: PropTypes.bool,
  /** Minimum ratio value */
  minRatio: PropTypes.number,
  /** Maximum ratio value */
  maxRatio: PropTypes.number,
  /** Auto-play time series on mount */
  autoPlay: PropTypes.bool,
  /** Playback speed in milliseconds between frames */
  playbackSpeed: PropTypes.number,
};

export default RatioDisplay;
