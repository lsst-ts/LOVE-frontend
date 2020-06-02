import React from 'react';
import PaginatedTable from '../PaginatedTable/PaginatedTable';
import styles from './ActionableTable.module.css';
import FilterButton from '../../HealthStatusSummary/TelemetrySelectionTable/ColumnHeader/FilterButton/FilterButton';
import FilterDialog from '../../HealthStatusSummary/TelemetrySelectionTable/FilterDialog/FilterDialog';
import PropTypes from 'prop-types';

import {
  ASCENDING,
  DESCENDING,
  UNSORTED,
} from '../../HealthStatusSummary/TelemetrySelectionTable/FilterDialog/FilterDialog.jsx';

const defaultSort = (row1, row2, sortingColumn, sortDirection) => {
  const value1 = row1?.[sortingColumn];
  const value2 = row2?.[sortingColumn];
  if (value1 === undefined || value1 === null) return 0;
  if (value2 === undefined || value2 === null) return 0;

  const sortFactor = sortDirection === ASCENDING ? 1 : -1;
  if (value1 < value2) return -1 * sortFactor;
  if (value1 > value2) return 1 * sortFactor;
  return 0;
};

const defaultColumnFilter = (filterString, value) => {
  try {
    const regexp = filterString === '' || filterString === undefined? new RegExp('(?:)') : new RegExp(filterString, 'i');
    return regexp.test(value);
  } catch (e) {
    console.warn('Invalid filter value in regexp', value);
  }
  return true;
};
/**
 * A table that can run actions over its data such as
 * sorting and filtering from a dialog in its column header.
 * Default actions are sorting and filtering but can be overwritten.
 *
 * It is built with <a href="/#/API?id=simpletable">SimpleTable<a/>
 */
const ActionableTable = function ({ data, headers }) {
  const [activeFilterDialogIndex, setActiveFilterDialogIndex] = React.useState(null);
  const [filters, setFilters] = React.useState({});
  const [sortDirections, setSortDirections] = React.useState({});
  const [sortingColumn, setSortingColumn] = React.useState(null);

  React.useEffect(() => {
    const initialFilters = headers.reduce((prevDict, header) => {
      prevDict[header.field] = '';
      return prevDict;
    }, {});

    const initialSortDirections = headers.reduce((prevDict, header) => {
      prevDict[header.field] = UNSORTED;
      return prevDict;
    }, {});

    setFilters(initialFilters);
    setSortDirections(initialSortDirections);
  }, [headers]);

  const columnOnClick = (ev, index) => {
    if (activeFilterDialogIndex === index) {
      setActiveFilterDialogIndex(null);
      return;
    }

    setActiveFilterDialogIndex(index);
  };

  const changeFilter = (event, filterName) => {
    const value = event.target.value;
    setFilters((filters) => {
      return {
        ...filters,
        [filterName]: value,
      };
    });
  };

  const closeFilterDialogs = () => {
    setActiveFilterDialogIndex(null);
  };

  const changeSortDirection = (direction, column) => {
    setSortDirections((sortDirections) => ({
      ...sortDirections,
      [column]: direction,
    }));
    setSortingColumn(column);
  };

  const newHeaders = headers.map((header, index) => {
    const isFiltered = filters?.[header.field] !== '';
    return {
      ...header,
      title: (
        <div className={styles.columnHeader}>
          <span className={styles.primaryText}>{header.title}</span>
          <span className={styles.secondaryText}>{header.subtitle}</span>
          <FilterButton
            filterName={header.field}
            selected={activeFilterDialogIndex === index}
            isFiltered={isFiltered}
            columnOnClick={(ev) => columnOnClick(ev, index)}
            sortDirection={sortDirections[header.field]}
          />
          <FilterDialog
            show={activeFilterDialogIndex === index}
            changeFilter={(event) => changeFilter(event, header.field)}
            closeFilterDialogs={closeFilterDialogs}
            changeSortDirection={changeSortDirection}
            columnName={header.field}
            sortingColumn={sortingColumn}
          />
        </div>
      ),
    };
  });

  // only recalculate when necessary.
  const transformedData = React.useMemo(() => {
    const newData = data
      .filter((row) => {
        return headers.reduce((prevBool, header) => {
          // if(header.field === 'position'){
          //   debugger;
          // }
          const filter = header.filter ?? defaultColumnFilter;
          const filterResult = filter(filters[header.field], row[header.field]);
          return prevBool && filterResult;
        }, true);
      })
      .sort((row1, row2) => {
        /** No sorting */
        const sortDirection = sortDirections[sortingColumn];
        if (sortDirection === UNSORTED) return 0;

        /** No sorting column */
        if (!sortingColumn) return 0;

        /** No cell value */
        const header = headers.find((header) => header.field === sortingColumn);
        const sort = header?.sort ?? defaultSort;
        const sortFactor = sortDirection === ASCENDING ? 1 : -1;

        return sort(row1[sortingColumn], row2[sortingColumn], sortFactor, row1, row2);
      });
    return newData;
  }, [data, sortingColumn, sortDirections, filters]);

  return <PaginatedTable data={transformedData} headers={newHeaders} />;
};

ActionableTable.propTypes = {
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
      /** Function to sort table rows.
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

export default ActionableTable;
