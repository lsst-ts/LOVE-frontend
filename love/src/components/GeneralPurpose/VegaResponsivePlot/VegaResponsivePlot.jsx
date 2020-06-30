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

const VegaResponsivePlot = ({ layers, legend }) => {
  const marksStyles = legend.map(({ name }, index) => {
    return {
      ...defaultStyles[index % defaultStyles.length],
      name,
    };
  });

  return (
    <div className={styles.container}>
      <VegaTimeseriesPlot
        layers={layers}
        xAxisTitle="date title"
        yAxisTitle="values title"
        marksStyles={marksStyles}
        temporalXAxis
        width={300}
        height={150}
        className={styles.plot}
      />
      <VegaLegend listData={legend} marksStyles={marksStyles} />
    </div>
  );
};

export default VegaResponsivePlot;
