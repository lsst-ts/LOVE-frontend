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

import { memo } from 'react';
import PropType from 'prop-types';
import styles from './VegaLegend.module.css';
import VegaMiniPlot from './VegaMiniPlot';

const VegaLegend = ({ gridData = [[]], marksStyles = [], listData = [] }) => {
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

VegaLegend.propTypes = {
  /** Data to be displayed in the legend
   * if listData is not provided
   */
  gridData: PropType.arrayOf(
    PropType.arrayOf(
      PropType.shape({
        name: PropType.string,
        label: PropType.node,
      }),
    ),
  ),
  /** Styles for the marks */
  marksStyles: PropType.arrayOf(
    PropType.shape({
      name: PropType.string,
      label: PropType.node,
      color: PropType.string,
      markType: PropType.string,
    }),
  ),
  /** Data to be displayed in the legend */
  listData: PropType.arrayOf(
    PropType.shape({
      name: PropType.string,
      label: PropType.node,
    }),
  ),
};

export default memo(VegaLegend);
