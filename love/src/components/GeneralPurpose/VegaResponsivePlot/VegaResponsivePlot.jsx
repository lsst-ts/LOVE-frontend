import React from 'react';
import VegaTimeseriesPlot from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import VegaLegend from '../VegaTimeSeriesPlot/VegaLegend';
import styles from './VegaResponsivePlot.module.css';

const defaultStyles = [
  {
    color: '#ff7bb5',
    shape: 'circle',
    filled: false,
    dash: [4, 0],
  },
  {
    color: '#00b7ff',
    shape: 'square',
    filled: true,
    dash: [4, 0],
  },

  {
    color: '#97e54f',
    shape: 'diamond',
    filled: true,
    dash: [4, 0],
  },
];

const VegaResponsivePlot = ({ layers, legend, width, height }) => {
  const marksStyles = legend.map(({ name }, index) => {
    return {
      ...defaultStyles[index % defaultStyles.length],
      name,
    };
  });

  return (
    <div
      className={styles.container}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <VegaTimeseriesPlot
        layers={layers}
        xAxisTitle="date title"
        yAxisTitle="values title"
        marksStyles={marksStyles}
        temporalXAxis
        width={width-150} // from the .autogrid grid-template-columns 
        height={height}
        className={styles.plot}
      />
      <VegaLegend listData={legend} marksStyles={marksStyles} />
    </div>
  );
};

export default VegaResponsivePlot;
