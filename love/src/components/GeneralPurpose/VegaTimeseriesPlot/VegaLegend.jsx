import React from 'react';
import styles from './VegaLegend.module.css';
import VegaMiniPlot from './VegaMiniPlot';

const VegaLegend = function ({ gridData, marksStyles, listData }) {
  if (gridData?.length?.length > 0) {
    const nrows = gridData.length;
    const ncols = gridData.reduce((prevMax, row) => Math.max(row.length, prevMax), 0);

    const filledGridData = gridData.map((row) => {
      if (row.length === ncols) {
        return row;
      }
      return [...row, new Array(ncols - row.length).fill(undefined)];
    });

    return (
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${ncols}, auto)`,
        }}
      >
        {filledGridData.map((row) => {
          return row.map((cell) => {
            const style = marksStyles.find((s) => s.name === cell.name);

            return (
              <div className={styles.cell}>
                {cell?.label || ''} {style && <VegaMiniPlot {...style} />}
              </div>
            );
          });
        })}
      </div>
    );
  }

  return (
    <div className={styles.autoGrid}>
      {listData.map((cell) => {
        const style = marksStyles.find((s) => s.name === cell.name);

        return (
          <div className={styles.cell}>
            {cell?.label || ''} {style && <VegaMiniPlot {...style} />}
          </div>
        );
      })}
    </div>
  );
};

VegaLegend.defaultProps = {
  gridData: [[]],
  listData: [],
  marksStyles: [],
};

export default VegaLegend;
