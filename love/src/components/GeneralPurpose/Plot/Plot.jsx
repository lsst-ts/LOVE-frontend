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
import { ISO_STRING_DATE_TIME_FORMAT, TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import ManagerInterface, { getEFDInstanceForHost, parseCommanderData, parsePlotInputsEFD, parseTimestamp } from 'Utils';
import { defaultStyles } from './Plot.container';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import TimeSeriesControls from './TimeSeriesControls/TimeSeriesControls';
import VegaLegend from './VegaTimeSeriesPlot/VegaLegend';
import styles from './Plot.module.css';

const LAYER_TYPES = ['lines', 'bars', 'pointLines', 'arrows', 'areas', 'spreads', 'bigotes', 'rects', 'heatmaps'];

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
  sizeLimit = 1800,
  scaleIndependent = false,
  scaleDomain,
  taiToUtc = 37,
  topicsFieldsInfo,
  subscribeToStreams,
  unsubscribeToStreams,
}) => {
  const [liveData, setLiveData] = useState({});
  const [isLive, setIsLive] = useState(timeSeriesControlsProps?.isLive ?? true);
  const [timeWindow, setTimeWindow] = useState(timeSeriesControlsProps?.timeWindow ?? 60);
  const [historicalData, setHistoricalData] = useState(timeSeriesControlsProps?.historicalData ?? []);
  const [plotWidth, setPlotWidth] = useState(width);
  const [plotHeight, setPlotHeight] = useState(height);

  const timeSeriesControlRef = useRef();
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
        ...defaultStyles[index % defaultStyles.length],
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

  /** Queries the EFD for timeseries data based on the start date and time window.
   * @param {Moment} startDate - Start date of the query.
   * @param {number} timeWindow - Time window in minutes.
   */
  const handleHistoricalData = (startDate, timeWindow) => {
    const efdInstance = getEFDInstanceForHost();
    if (!efdInstance) {
      return;
    }
    const parsedDate = startDate.utc().format(ISO_STRING_DATE_TIME_FORMAT);
    const cscs = parsePlotInputsEFD(inputs);
    const tsLabel = 'x';
    const valueLabel = 'y';
    ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min', efdInstance).then((data) => {
      if (!data) return;
      const parsedData = parseCommanderData(data, tsLabel, valueLabel, topicsFieldsInfo);
      setHistoricalData(parsedData);
    });
  };

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
      handleHistoricalData(currentDate, timeWindow);
    }
  }, [inputs, topicsFieldsInfo]);

  /** Get data for the plot, based on the inputs
   * @param {string} inputName - Input name present in both historicalData and liveData
   *
   * This function merges live and historical data for a given input.
   * It filters the data based on the current time window and
   * limits the size of the data to a specified size limit.
   */
  const mergeLiveAndHistoricalData = (inputName) => {
    let filteredData;
    const topics = getTopicItemPair(inputs);
    const [topicName, property] = topics[inputName];
    const inputConfig = inputs[inputName];
    const { accessor } = inputConfig.values[0];
    const accessorFunc = eval(accessor);
    const parsedHistoricalData = (historicalData[topicName]?.[property] ?? []).map((dataPoint) => ({
      ...dataPoint,
      name: inputName,
      y: accessorFunc(dataPoint.y),
    }));

    if (!isLive) {
      filteredData = parsedHistoricalData;
    } else {
      const joinedData = (parsedHistoricalData ?? []).concat(liveData[inputName] ?? []);
      filteredData = joinedData.filter((val) => {
        const currentSeconds = new Date().getTime() / 1000;
        const timemillis = val.x?.ts ?? val.x;
        const dataSeconds = timemillis / 1000 + taiToUtc;
        if (dataSeconds >= currentSeconds - timeWindow * 60) return true;
        return false;
      });
    }

    if (filteredData.length > sizeLimit) {
      filteredData = filteredData.slice(-1 * sizeLimit);
    }
    return filteredData;
  };

  /** Effect to parse inputs and streams data */
  useEffect(() => {
    const newData = {};
    for (const [inputName, inputConfig] of Object.entries(inputs)) {
      const inputData = [...(liveData[inputName] ?? [])];
      const lastValue = inputData.length > 0 ? inputData[inputData.length - 1] : null;
      const { category, csc, salindex, topic, item, accessor } = inputConfig.values[0];
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
    setLiveData(newData);
  }, [inputs, streams, sizeLimit]);

  const dataLastTimestampHash = useMemo(() => {
    return Object.entries(liveData)
      .map(([key, value]) => `${key}:${value.length > 1 ? value[value.length - 1].x.ts : 0}`)
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
      const inputData = mergeLiveAndHistoricalData(inputName);
      layers[layerName] = [...(layers[layerName] ?? []), ...inputData];
    }
    return layers;
  }, [dataLastTimestampHash, inputs]);

  return (
    <>
      {controls && (
        <div className={styles.controlsContainer} ref={timeSeriesControlRef}>
          <TimeSeriesControls
            isLive={isLive}
            setLiveMode={setIsLive}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            setHistoricalData={handleHistoricalData}
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
