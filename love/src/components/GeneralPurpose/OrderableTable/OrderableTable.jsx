/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

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

import React from 'react';
import PropTypes from 'prop-types';
import SimpleTable from '../SimpleTable/SimpleTable';
import { SORT_ASCENDING, SORT_DESCENDING, SORT_UNSORTED } from 'Config';
import styles from './OrderableTable.module.css';

const defaultSort = (row1, row2, sortingColumn, sortDirection) => {
  const value1 = row1?.[sortingColumn];
  const value2 = row2?.[sortingColumn];

  if (value1 === undefined || value1 === null) return 0;
  if (value2 === undefined || value2 === null) return 0;

  const sortFactor = sortDirection === SORT_ASCENDING ? 1 : -1;
  if (value1 < value2) return -1 * sortFactor;
  if (value1 > value2) return 1 * sortFactor;
  return 0;
};

/**
 * A table that can sorted by specific columns.
 * Default sorting can be overwritten for each column.
 */
const OrderableTable = function ({ data, headers, ...otherProps }) {
  const [sortDirections, setSortDirections] = React.useState({});
  const [sortingColumn, setSortingColumn] = React.useState(null);

  const initialSortDirections = headers.reduce((prevDict, header) => {
    prevDict[header.field] = SORT_UNSORTED;
    return prevDict;
  }, {});

  React.useEffect(() => {
    setSortDirections(initialSortDirections);
  }, []);

  const changeSortDirection = (column) => {
    let newDirection = SORT_UNSORTED;
    if (sortDirections[column] === SORT_UNSORTED) {
      newDirection = SORT_ASCENDING;
    } else if (sortDirections[column] === SORT_ASCENDING) {
      newDirection = SORT_DESCENDING;
    }
    setSortDirections((sortDirections) => ({
      ...initialSortDirections,
      [column]: newDirection,
    }));
    setSortingColumn(column);
  };

  const newHeaders = headers.map((header, index) => {
    const sortDirection = sortDirections[header.field];
    return {
      ...header,
      title: (
        <div className={styles.columnHeader}>
          <span className={styles.primaryText}>{header.title}</span>
          <span className={styles.secondaryText}>{header.subtitle}</span>
          <div className={styles.orderSymbol} onClick={() => changeSortDirection(header.field)}>
            <span title="Ascending order" className={sortDirection === SORT_ASCENDING ? styles.selected : ''}>
              ▲
            </span>
            <span title="Descending order" className={sortDirection === SORT_DESCENDING ? styles.selected : ''}>
              ▼
            </span>
          </div>
        </div>
      ),
    };
  });

  // only recalculate when necessary.
  const transformedData = React.useMemo(() => {
    const newData = data.toSorted((row1, row2) => {
      /** No sorting column */
      if (!sortingColumn) return 0;

      /** No sorting applied */
      const sortDirection = sortDirections[sortingColumn];
      if (sortDirection === SORT_UNSORTED) return 0;

      const header = headers.find((header) => header.field === sortingColumn);
      const sort = header?.sort ?? defaultSort;
      return sort(row1, row2, sortingColumn, sortDirection);
    });
    return newData;
  }, [data, sortingColumn, sortDirections, headers]);

  return <SimpleTable data={transformedData} headers={newHeaders} {...otherProps} />;
};

OrderableTable.propTypes = {
  /** Array with properties of table columns and its headers.*/
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      /** (Inherited from SimpleTable) Property accessor of this column's value on each data row */
      field: PropTypes.string,
      /** (Inherited from SimpleTable)  Node to be rendered as header label */
      title: PropTypes.node,
      /** Text/node shown below the header title */
      subtitle: PropTypes.node,
      /** (Inherited from SimpleTable) Data type of this column: number, string, ... */
      type: PropTypes.string,
      /** (Inherited from SimpleTable) Callback that receives this column's value and should return a `node`.
       * Use it customize how the cell's value is   */
      render: PropTypes.func,
      /** (Inherited from SimpleTable) className to be applied to the whole column */
      className: PropTypes.string,
      /** Function to sort table rows. Defaults to regular (>, <, ===) comparison.
       * Its signature is `(row1, row2, sortingColumn, sortingDirection) => value` where:
       * (row1, row2)  are two rows of the `data` array to compare;
       * (sortingColumn) is the currently selected column that runs the sorting. Only one column at a time;
       * (sortingDirection): indicates the user-selected sorting direction, can be 'ascending' or something else for descending
       * (value) is 1, 0 or -1, and passed to Array.Prototype.sort
       * */
      sort: PropTypes.func,
    }),
  ),
  /** Rows to be rendered in the table */
  data: PropTypes.arrayOf(PropTypes.object),
};

export default OrderableTable;
