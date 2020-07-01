import React from 'react';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import VegaLegend from './VegaTimeSeriesPlot/VegaLegend';
import styles from './Plot.module.css';

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

const Plot = ({ layers, legend, width, height, containerNode, xAxisTitle, yAxisTitle, units }) => {
  const marksStyles = legend.map(({ name }, index) => {
    return {
      ...defaultStyles[index % defaultStyles.length],
      name,
    };
  });

  const [containerSize, setContainerSize] = React.useState({});

  React.useEffect(() => {
    if (width !== undefined && height !== undefined) {
      setContainerSize({
        width,
        height,
      });
      return;
    }

    if (containerNode !== undefined) {
      const resizeObserver = new ResizeObserver((entries) => {
        const container = entries[0];
        setContainerSize({
          width: container.contentRect.width,
          height: container.contentRect.height,
        });
      });

      if(!(containerNode instanceof Element)) return;
      resizeObserver.observe(containerNode);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerNode, width, height]);

  return (
    <div
      className={styles.container}
      style={{
        width: `${containerSize.width}px`,
        height: `${containerSize.height}px`,
      }}
    >
      <VegaTimeseriesPlot
        layers={layers}
        xAxisTitle={xAxisTitle}
        yAxisTitle={yAxisTitle}
        units={units}
        marksStyles={marksStyles}
        temporalXAxis
        width={containerSize.width - 150} // from the .autogrid grid-template-columns
        height={containerSize.height}
        className={styles.plot}
      />
      <VegaLegend listData={legend} marksStyles={marksStyles} />
    </div>
  );
};

export default Plot;
