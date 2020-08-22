import React from 'react';
import PropTypes from 'prop-types';
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

const Plot = ({
  layers,
  legend,
  width,
  height,
  containerNode,
  xAxisTitle,
  yAxisTitle,
  units,
  marksStyles,
  legendPosition = 'right',
}) => {
  /** Fill marksStyles to satisfy the VegaTimeseriesPlot and VegaLegend APIs */
  const completedMarksStyles = React.useMemo(() => {
    return legend.map(({ name, markType }, index) => {
      const style = marksStyles?.find((style) => style.name === name);
      if (!style) {
        return {
          ...defaultStyles[index % defaultStyles.length],
          ...(markType !== undefined ? { markType } : {}),
          name,
        };
      }
      return {
        ...style,
        ...(markType !== undefined ? { markType } : {}),
      };
    });
  }, [legend, marksStyles]);

  const [containerSize, setContainerSize] = React.useState({});

  /** Auto resize features */
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

      if (!(containerNode instanceof Element)) return;
      resizeObserver.observe(containerNode);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerNode, width, height]);

  return (
    <div
      className={[styles.container, legendPosition === 'bottom' ? styles.bottomLegend : ''].join(' ')}
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
        marksStyles={completedMarksStyles}
        temporalXAxis
        width={legendPosition === 'right' ? containerSize.width - 150 : containerSize.width} // from the .autogrid grid-template-columns
        height={legendPosition === 'bottom' ? containerSize.height - 25 : containerSize.height}
        className={styles.plot}
      />
      <VegaLegend listData={legend} marksStyles={completedMarksStyles} />
    </div>
  );
};

Plot.propTypes = {
  /** Data to be used to build a legend */
  legend: PropTypes.arrayOf(
    PropTypes.shape({
      /** Name of the mark that is being plotted */
      name: PropTypes.string.isRequired,

      /** Node or text to be displayed in the legend for this mark */
      label: PropTypes.node,

      /** Which mark to use to plot this data */
      markType: PropTypes.oneOf(['line', 'pointLine', 'bar']),
    }),
  ),
  /**
   * (optional) defines the styles of each mark to be plotted.
   * Defaults to values from a styles-loop.
   */
  marksStyles: PropTypes.arrayOf(
    PropTypes.shape({
      /** (All layers) `name` attribute of the data to apply these styles.
       * Rows of data with no name-matching markStyle will not be rendered.
       */
      name: PropTypes.string,
      /** (All layers) hex color */
      color: PropTypes.string,
      /** (Only `lines` layer). Dash pattern for segmented lines passed to the strokeDash channel. E.g, [2, 1] draws
       * a line with a pattern of 2 "filled" pixels and 1 "empty" pixel.
       */
      dash: PropTypes.arrayOf(PropTypes.number),
      /** (Only `pointLines` layer). Shape of the points to be drawn https://vega.github.io/vega-lite/docs/point.html*/
      shape: PropTypes.string,
      /** (Only `pointLines`) layer. Whether to draw a filled point or only its border. */
      filled: PropTypes.bool,
    }),
  ),
  /** Legend position: right or bottom */
  legendPosition: PropTypes.oneOf(['right', 'bottom']),
};

export default Plot;
