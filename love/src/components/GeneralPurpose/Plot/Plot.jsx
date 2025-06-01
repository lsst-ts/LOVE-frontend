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

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import { parseTimestamp, handlePlotHistoricalData } from 'Utils';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import VegaLegend from './VegaTimeSeriesPlot/VegaLegend';
import styles from './Plot.module.css';

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

/** Get pairs containing topic and item names of the form
 * [csc-index-topic, item], based on the inputs
 * @param {object} inputs - Object containing the inputs
 */
const getTopicItemPair = (inputs) => {
  const topics = {};
  Object.keys(inputs).forEach((inputKey) => {
    const input = inputs[inputKey];
    Object.values(input.values).forEach((value) => {
      topics[inputKey] = [`${value.csc}-${value.salindex}-${value.topic}`, value.item];
    });
  });
  return topics;
};

/** Make array of data for forecast plots */
const getForecastData = (inputName, data) => {
  if (!data) return [];
  return data.map((d) => ({ name: inputName, ...d }));
};

const Plot = ({
  xAxisTitle = 'Time',
  temporalXAxis = true,
  temporalXAxisFormat = '%H:%M',
  legendPosition = 'right',
  controls = false,
  inputs = {},
  streams = {},
  width,
  height,
  maxHeight = 240,
  containerNode,
  timeSeriesControlsProps,
  isForecast = false,
  sliceSize = 1800,
  sliceInvert = false,
  sizeLimit = 1800,
  scaleIndependent = false,
  scaleDomain,
  taiToUtc = 37,
  topicsFieldsInfo,
  subscribeToStreams,
  unsubscribeToStreams,
}) => {
  const [data, setData] = useState({});
  const [isLive, setIsLive] = useState(timeSeriesControlsProps?.isLive ?? true);
  const [timeWindow, setTimeWindow] = useState(timeSeriesControlsProps?.timeWindow ?? 60);
  const [historicalData, setHistoricalData] = useState(timeSeriesControlsProps?.historicalData ?? []);
  const [plotWidth, setPlotWidth] = useState(width);
  const [plotHeight, setPlotHeight] = useState(height);

  const timeSeriesControlRef = useRef();
  const legendRef = useRef();
  const resizeObserver = useRef();

  /** Queries the EFD for timeserresizeObserveries
   * @param {Moment} startDate - Start date of the query.
   * @param {number} timeWindow - Time window in minutes.
   */
  const memoizedHandleHistoricalData = useCallback(
    (startDate, timeWindow) => {
      return handlePlotHistoricalData(startDate, timeWindow, inputs, topicsFieldsInfo, setHistoricalData);
    },
    [inputs, topicsFieldsInfo, setHistoricalData],
  );

  /** Effect to handle historical data when the component mounts */
  useEffect(() => {
    if (
      historicalData.length === 0 &&
      inputs &&
      Object.keys(inputs).length > 0 &&
      topicsFieldsInfo &&
      Object.keys(topicsFieldsInfo).length > 0
    ) {
      const currentDate = Moment().subtract(timeWindow / 2, 'minutes');
      memoizedHandleHistoricalData(currentDate, timeWindow);
    }
  }, [JSON.stringify(inputs.values), topicsFieldsInfo, setHistoricalData]);

  /** Get data for the plot, based on the inputs
   * @param {object} data - Data to be filtered
   * @param {number} timeWindow - Time window in minutes
   *
   * Notes:
   * - If isLive is true, the data is filtered based on the timeWindow
   * - If isLive is false, the data is filtered based on the historicalData
   */
  const memoizedGetRangedData = useCallback(
    (dataArray) => {
      let filteredData;
      const topics = getTopicItemPair(inputs);
      const parsedHistoricalData = Object.keys(topics).flatMap((key) => {
        const [topicName, property] = topics[key];
        const inputConfig = inputs[key];
        // Usual telemetries only contains 1 value, hence we can use the first element of the array
        const { accessor } = inputConfig.values[0];
        /* eslint no-eval: 0 */
        const accessorFunc = eval(accessor);
        return (historicalData[topicName]?.[property] ?? []).map((dataPoint) => ({
          ...dataPoint,
          name: key,
          y: accessorFunc(dataPoint.y),
        }));
      });
      if (!isLive) {
        filteredData = parsedHistoricalData;
      } else {
        if ((!dataArray || dataArray.length == 0) && (!parsedHistoricalData || parsedHistoricalData.length == 0)) {
          return [];
        }
        const joinedData = parsedHistoricalData.concat(dataArray ?? []);
        filteredData = joinedData.filter((val) => {
          const currentSeconds = new Date().getTime() / 1000;
          const timemillis = val.x?.ts ?? val.x;
          const dataSeconds = timemillis / 1000 + taiToUtc;
          if (dataSeconds >= currentSeconds - (timeWindow * 60) / 2) return true;
          return false;
        });
      }
      return filteredData;
    },
    [inputs, historicalData, isLive, timeWindow, taiToUtc],
  );

  /** Parse inputs and streams to generate data to be plotted
   *
   * Notes:
   * - The data is stored in the state
   * - The data is parsed based on the inputs and streams
   * - The data is also sliced based on sizeLimit
   */
  const parseInputsStreams = () => {
    const newData = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const inputData = [...(data[inputName] ?? [])];
      const lastValue = inputData.length > 0 ? inputData[inputData.length - 1] : null;

      // Usual telemetries only contains 1 value, hence we can use the first element of the array
      const { category, csc, salindex, topic, item, accessor } = inputConfig.values[0];
      /* eslint no-eval: 0 */
      const accessorFunc = eval(accessor);

      const streamName = `${category}-${csc}-${salindex}-${topic}`;
      if (!streams[streamName]?.[item]) {
        continue;
      }

      const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];

      const newValue = {
        name: inputName,
        x: parseTimestamp(streamValue[TOPIC_TIMESTAMP_ATTRIBUTE]?.value * 1000),
        y: accessorFunc(streamValue[item]?.value),
      };

      if (lastValue?.x?.ts !== newValue.x?.ts && newValue.x) {
        inputData.push(newValue);
      }

      if (inputData.length > sizeLimit) {
        newData[inputName] = inputData.slice(-1 * sizeLimit);
      } else {
        newData[inputName] = inputData;
      }
    }
    setData(newData);
  };

  /** Parse inputs and streams to generate data to be plotted
   * Special case function for weather forecast
   *
   * Notes:
   * - The data is stored in the state
   * - The data is parsed based on the inputs and streams
   * - The data is also sliced based on sliceInvert, sliceSize and sizeLimit
   */
  const parseForecastInputsStreams = () => {
    const newData = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      let newValue = {
        name: inputName,
        values: {},
        units: {},
      };

      for (const value of Object.values(inputConfig.values)) {
        const { category, csc, salindex, topic, item, accessor, variable = 'y' } = value;
        /* eslint no-eval: 0 */
        const accessorFunc = eval(accessor);

        const streamName = `${category}-${csc}-${salindex}-${topic}`;
        if (!streams[streamName]?.[item]) {
          continue;
        }

        const streamValue = Array.isArray(streams[streamName]) ? streams[streamName][0] : streams[streamName];
        newValue['x'] = parseTimestamp(streamValue[TOPIC_TIMESTAMP_ATTRIBUTE]?.value * 1000);

        const val = accessorFunc(streamValue[item]?.value);
        const units = streamValue[item]?.units;

        newValue[variable] = val;
        newValue['units'][variable] = units;
        for (let i = 0; i < val.length; i++) {
          if (newValue.values[i] === undefined) newValue.values[i] = {};
          newValue.values[i][variable] = val[i];
        }
      }

      let inputData = [];
      Object.entries(newValue.values).forEach((entry) => {
        const input = Object.assign({}, entry[1]);
        input['units'] = newValue.units;
        input['x'] = parseTimestamp(entry[1]['x'] * 1000);
        inputData.push(input);
      });

      // Slice inputData array if it has more than sliceSize datapoints
      // (corresponding to one hour if telemetry is received every two seconds)
      if (inputData.length > sliceSize) {
        if (sliceInvert) {
          if (inputData.length > sizeLimit) {
            inputData = inputData.slice(-1 * sizeLimit).slice(0, sliceSize);
          } else {
            inputData = inputData.slice(0, sliceSize);
          }
        } else {
          inputData = inputData.slice(-1 * sliceSize);
        }
      }
      newData[inputName] = inputData;
    }
    setData(newData);
  };

  const setResizeObserver = () => {
    if (!(containerNode instanceof Element)) return;
    const resizeHandler = (entries) => {
      window.requestAnimationFrame(() => {
        const container = entries[0];
        const diffControlHeight = timeSeriesControlRef.current?.offsetHeight ?? 0;
        const diffAxisXTitleHeight = xAxisTitle !== '' ? 14 : 0;
        const diffLegendHeight =
          ((legendPosition === '' || legendPosition === 'bottom') && legendRef.current?.offsetHeight) || 0;
        const diffLegendWidth = (legendPosition === 'right' && legendRef.current?.offsetWidth) || 0;

        setPlotHeight(container.contentRect.height - diffControlHeight - diffAxisXTitleHeight - diffLegendHeight);
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
  }, [containerNode, width, height, timeSeriesControlRef.current, legendRef.current, legendPosition, xAxisTitle]);

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  useEffect(() => {
    if (isForecast) {
      parseForecastInputsStreams();
    } else {
      parseInputsStreams();
    }
  }, [inputs, streams, sliceSize, sliceInvert, sizeLimit, isForecast]);

  const layerTypes = ['lines', 'bars', 'pointLines', 'arrows', 'areas', 'spreads', 'bigotes', 'rects', 'heatmaps'];
  const layers = {};
  for (const [inputName, inputConfig] of Object.entries(inputs)) {
    const { type } = inputConfig;
    const layerName = type + 's';
    if (!layerTypes.includes(layerName)) {
      continue;
    }

    let inputData;
    if (isForecast) {
      inputData = getForecastData(inputName, data[inputName]);
    } else {
      inputData = memoizedGetRangedData(data[inputName]);
    }
    layers[layerName] = [...(layers[layerName] ?? []), ...inputData];
  }

  const memoizedLegend = useMemo(() => {
    return Object.keys(inputs).map((inputName, index) => {
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

  return (
    <>
      {controls && (
        <div className={styles.controlsContainer} ref={timeSeriesControlRef}>
          <TimeSeriesControls
            isLive={isLive}
            setLiveMode={setIsLive}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            setHistoricalData={memoizedHandleHistoricalData}
          />
        </div>
      )}
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

Plot.propTypes = {
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
  /** If true, controls to configure the time window will be rendered */
  controls: PropTypes.bool,
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
  /** Object with the configuration of the timeSeriesControls */
  timeSeriesControlsProps: PropTypes.object,
  /** In the weatherforecast telemetries is received data in one array with time and value.
   * In other telemetries, the data is received one to one */
  isForecast: PropTypes.bool,
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

export default Plot;
