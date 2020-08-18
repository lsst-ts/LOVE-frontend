import React from 'react';
import PropType from 'prop-types';
import styles from './VegaLegend.module.css';
import VegaMiniPlot from './VegaMiniPlot';

const VegaLegend = function ({ gridData, marksStyles, listData }) {
  if (listData.length > 0) {
    return (
      <div className={styles.autoGrid}>
        {listData.map((cell) => {
          const style = marksStyles.find((s) => s.name === cell.name);

          return (
            <div key={cell.name} className={styles.cell}>
              {style && <VegaMiniPlot {...style} markType={style.markType || 'line'} />} {cell?.label || ''}
            </div>
          );
        })}
      </div>
    );
  }
  // const nrows = gridData.length;
  const ncols = gridData.reduce((prevMax, row) => Math.max(row.length, prevMax), 0);
  const filledGridData = gridData.map((row) => {
    if (row.length === ncols) {
      return row;
    }
    return [...row, ...new Array(ncols - row.length).fill(undefined)];
  });

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${ncols}, auto`,
      }}
    >
      {filledGridData.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          if (cell === undefined) {
            return (
              <div key={`${rowIndex}-${colIndex}`} className={styles.cell}>
                {' '}
              </div>
            );
          }

          const style = marksStyles.find((s) => s.name === cell.name);
          return (
            <div key={cell.name} className={styles.cell}>
              {style && <VegaMiniPlot {...style} markType={cell.markType || 'line'} />} {cell?.label || ''}
            </div>
          );
        });
      })}
    </div>
  );
};

VegaLegend.defaultProps = {
  gridData: [[]],
  listData: [],
  marksStyles: [],
};

VegaLegend.propTypes = {
  gridData: PropType.arrayOf(
    PropType.arrayOf(
      PropType.shape({
        name: PropType.string,
        label: PropType.node,
      }),
    ),
  ),
  listData: PropType.arrayOf(
    PropType.shape({
      name: PropType.string,
      label: PropType.node,
    }),
  ),
};

export default VegaLegend;
