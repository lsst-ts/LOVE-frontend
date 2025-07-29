/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import { parseTimestamp } from 'Utils';
import VegaTimeseriesPlot from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import VegaLegend from '../VegaTimeSeriesPlot/VegaLegend';
import styles from './ForecastPlot.module.css';

const DEFAULT_STYLES = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    orient: 'left',
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    orient: 'left',
    dash: [4, 0],
  },
  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    orient: 'right',
    dash: [4, 0],
  },
];

const LAYER_TYPES = ['lines', 'bars', 'pointLines', 'arrows', 'areas', 'spreads', 'bigotes', 'rects', 'heatmaps'];

/**
 * Slices the input data array based on the specified parameters.
 * This function is used to limit the amount of data displayed in the plot.
 *
 * @param {Object} inputData - The input data array to be sliced.
 * @param {number} sliceSize - The maximum size of the data slice.
 * @param {boolean} sliceInvert - Whether to invert the slice order.
 * @param {number} sizeLimit - The maximum size limit for the data.
 */
const sliceInputData = (inputData, sliceSize, sliceInvert, sizeLimit) => {
  if (inputData.length > sliceSize) {
    if (sliceInvert) {
      if (inputData.length > sizeLimit) {
        return inputData.slice(-1 * sizeLimit).slice(0, sliceSize);
      } else {
        return inputData.slice(0, sliceSize);
      }
    } else {
      return inputData.slice(-1 * sliceSize);
    }
  }
  return inputData;
};

const ForecastPlot = ({
  xAxisTitle = 'Time',
  temporalXAxis = true,
  temporalXAxisFormat = '%H:%M',
  legendPosition = 'right',
  inputs = {},
  streams = {},
  width,
  height,
  maxHeight = 240,
  containerNode,
  sliceSize = 1800,
  sliceInvert = false,
  sizeLimit = 1800,
  scaleIndependent = false,
  scaleDomain,
  subscribeToStreams,
  unsubscribeToStreams,
}) => {
  const [liveData, setLiveData] = useState({});
  const [plotWidth, setPlotWidth] = useState(width);
  const [plotHeight, setPlotHeight] = useState(height);

  const legendRef = useRef();
  const resizeObserver = useRef();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  const setResizeObserver = () => {
    if (!(containerNode instanceof Element)) return;
    const resizeHandler = (entries) => {
      window.requestAnimationFrame(() => {
        const container = entries[0];
        const diffAxisXTitleHeight = xAxisTitle !== '' ? 14 : 0;
        const diffLegendHeight =
          ((legendPosition === '' || legendPosition === 'bottom') && legendRef.current?.offsetHeight) || 0;
        const diffLegendWidth = (legendPosition === 'right' && legendRef.current?.offsetWidth) || 0;

        setPlotHeight(container.contentRect.height - diffAxisXTitleHeight - diffLegendHeight);
        setPlotWidth(container.contentRect.width - diffLegendWidth);
      });
    };

    resizeObserver.current = new ResizeObserver(resizeHandler);
    resizeObserver.current.observe(containerNode);
  };

  /**
   * Set resize observer if containerNode is defined and width and height are not defined.
   */
  useEffect(() => {
    if (width === undefined && height === undefined && containerNode) {
      setResizeObserver();
    }
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [containerNode, width, height, legendRef.current, legendPosition, xAxisTitle]);

  const memoizedLegend = useMemo(() => {
    return Object.keys(inputs).map((inputName) => {
      return {
        label: inputName,
        name: inputName,
        markType: inputs[inputName].type,
      };
    });
  }, [inputs]);

  const memoizedMarksStyles = useMemo(() => {
    return Object.keys(inputs).map((inputName, index) => {
      return {
        name: inputName,
        ...DEFAULT_STYLES[index % DEFAULT_STYLES.length],
        ...(inputs[inputName].type !== undefined ? { markType: inputs[inputName].type } : {}),
        ...(inputs[inputName].color !== undefined ? { color: inputs[inputName].color } : {}),
        ...(inputs[inputName].dash !== undefined ? { dash: inputs[inputName].dash } : {}),
        ...(inputs[inputName].shape !== undefined ? { shape: inputs[inputName].shape } : {}),
        ...(inputs[inputName].filled !== undefined ? { filled: inputs[inputName].filled } : {}),
        ...(inputs[inputName].orient !== undefined ? { orient: inputs[inputName].orient } : { orient: 'left' }),
        ...(inputs[inputName].hideAxis !== undefined ? { hideAxis: inputs[inputName].hideAxis } : { hideAxis: false }),
        ...(inputs[inputName].offset !== undefined ? { offset: inputs[inputName].offset } : { offset: 0 }),
      };
    });
  }, [inputs]);

  /** Effect to parse inputs and streams data */
  useEffect(() => {
    const newData = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const newValue = {
        name: inputName,
        values: [],
        units: {},
      };

      for (const value of Object.values(inputConfig.values)) {
        const { category, csc, salindex, topic, item, accessor, variable = 'y' } = value;
        const accessorFunc = eval(accessor);

        const streamName = `${category}-${csc}-${salindex}-${topic}`;
        if (!streams[streamName]?.[item]) {
          continue;
        }

        const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];
        const values = accessorFunc(streamValue[item]?.value);
        const units = streamValue[item]?.units;

        newValue['x'] = parseTimestamp(streamValue[TOPIC_TIMESTAMP_ATTRIBUTE]?.value * 1000);
        newValue['units'][variable] = units;

        for (let i = 0; i < values.length; i++) {
          newValue.values[i] = {
            ...(newValue.values[i] ?? {}),
            [variable]: values[i],
          };
        }
      }

      const inputData = [];
      Object.entries(newValue.values).forEach((entry) => {
        const input = { ...entry[1] };
        input['units'] = newValue.units;
        input['x'] = parseTimestamp(input['x'] * 1000);
        inputData.push(input);
      });

      newData[inputName] = sliceInputData(inputData, sliceSize, sliceInvert, sizeLimit);
    }
    setLiveData(newData);
  }, [inputs, streams, sliceSize, sliceInvert, sizeLimit]);

  const dataLengthsHash = useMemo(() => {
    return Object.entries(liveData)
      .map(([key, value]) => `${key}:${value.length}`)
      .join('|');
  }, [liveData]);

  const layers = useMemo(() => {
    const layers = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const { type } = inputConfig;
      const layerName = type + 's';
      if (!LAYER_TYPES.includes(layerName)) {
        continue;
      }

      const inputData = (liveData[inputName] ?? []).map((d) => ({
        name: inputName,
        ...d,
      }));
      layers[layerName] = [...(layers[layerName] ?? []), ...inputData];
    }
    return layers;
  }, [dataLengthsHash, inputs]);

  return (
    <>
      {legendPosition === 'right' ? (
        <div className={styles.containerFlexRow}>
          <VegaTimeseriesPlot
            width={plotWidth}
            height={plotHeight}
            layers={layers}
            xAxisTitle={xAxisTitle}
            marksStyles={memoizedMarksStyles}
            temporalXAxis={temporalXAxis}
            temporalXAxisFormat={temporalXAxisFormat}
            scaleIndependent={scaleIndependent}
            scaleDomain={scaleDomain}
          />
          <div ref={legendRef}>
            <VegaLegend listData={memoizedLegend} marksStyles={memoizedMarksStyles} />
          </div>
        </div>
      ) : (
        <div className={styles.containerFlexCol} style={maxHeight ? { maxHeight: maxHeight } : {}}>
          <div>
            <VegaTimeseriesPlot
              width={plotWidth}
              height={plotHeight}
              layers={layers}
              xAxisTitle={xAxisTitle}
              marksStyles={memoizedMarksStyles}
              temporalXAxis={temporalXAxis}
              temporalXAxisFormat={temporalXAxisFormat}
              scaleIndependent={scaleIndependent}
              scaleDomain={scaleDomain}
            />
          </div>
          <div ref={legendRef} className={styles.marginLegend}>
            <VegaLegend listData={memoizedLegend} marksStyles={memoizedMarksStyles} />
          </div>
        </div>
      )}
    </>
  );
};

ForecastPlot.propTypes = {
  /** Title of the x axis */
  xAxisTitle: PropTypes.string,
  /** Title of the y axis */
  yAxisTitle: PropTypes.string,
  /** If true, x axis labels will be rendered as timestamps */
  temporalXAxis: PropTypes.bool,
  /** If temporalXAxis is true, this string will be used to format the x axis labels */
  temporalXAxisFormat: PropTypes.string,
  /** Position of the legends: right or bottom */
  legendPosition: PropTypes.string,
  /** Inputs for the plot */
  inputs: PropTypes.object,
  /** Width of the plot in pixels */
  width: PropTypes.number,
  /** Height of the plot in pixels */
  height: PropTypes.number,
  /** Max height of the plot in pixels */
  maxHeight: PropTypes.number,
  /** Node to be used to track width and height.
   *  Use this instead of props.width and props.height for responsive plots.
   *  Will be ignored if both props.width and props.height are provided */
  containerNode: PropTypes.instanceOf(Element),
  /** Size of the slice array, when receive more the historical data that the window time for the visualization */
  sliceSize: PropTypes.number,
  /** In weatherforecast for the hourly telemetry, receive 14 days to the future, but It's necessary the firts 48 hours.
   * Used for the correctly operation of array between daily and hourly telemetry */
  sliceInvert: PropTypes.bool,
  /** Size array of telemetry of the weatherforecast, It's needed for the correctly slice */
  sizeLimit: PropTypes.number,
  /** Used for the multi axis when the scale of data is difference, for example the units data is percent and milimeters */
  scaleIndependent: PropTypes.bool,
  /** Used for the set limit range of the plot */
  scaleDomain: PropTypes.shape({
    /** Max value of the domain */
    domainMax: PropTypes.number,
    /** Min value of the domain */
    domainMin: PropTypes.number,
  }),
  /** Function to subscribe to streams to receive */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe to streams to stop receiving */
  unsubscribeToStreams: PropTypes.func,
};

export default ForecastPlot;
