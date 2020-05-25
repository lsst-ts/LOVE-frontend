import React from 'react';
import SimpleTable from '../SimpleTable/SimpleTable';
import styles from './ActionableTable.module.css';
import FilterButton from '../../HealthStatusSummary/TelemetrySelectionTable/ColumnHeader/FilterButton/FilterButton';
import FilterDialog from '../../HealthStatusSummary/TelemetrySelectionTable/FilterDialog/FilterDialog';
import { ASCENDING, DESCENDING, UNSORTED } from '../../HealthStatusSummary/TelemetrySelectionTable/FilterDialog/FilterDialog.jsx'

/**
 * A table that can run actions over its data such as
 * sorting and filtering from a dialog in its column header.
 * Default actions are sorting and filtering but can be overwritten.
 */
const ActionableTable = function ({ data, headers }) {

    const [activeFilterDialogIndex, setActiveFilterDialogIndex] = React.useState(null);
    const [filters, setFilters] = React.useState({});
    const [sortDirections, setSortDirections] = React.useState({});
    const [sortingColumn, setSortingColumn] = React.useState(null);

    React.useEffect(() => {
        const initialFilters = headers.reduce((prevDict, header) => {
            prevDict[header.field] = {
                type: 'regexp',
                value: new RegExp('(?:)')
            }
            return prevDict;
        }, {});

        const initialSortDirections = headers.reduce((prevDict, header) => {
            prevDict[header.field] = UNSORTED;
            return prevDict;
        }, {});

        setFilters(initialFilters);
        setSortDirections(initialSortDirections)
    }, [headers]);

    const columnOnClick = (ev, index) => {
        if (activeFilterDialogIndex === index) {
            setActiveFilterDialogIndex(null);
            return;
        }

        setActiveFilterDialogIndex(index);
    }

    const changeFilter = (event, filterName) => {
        try {

            const newFilter = event.target.value === '' ? new RegExp('(?:)') : new RegExp(event.target.value, 'i');
            setFilters((filters) => {
                return {
                    ...filters,
                    [filterName]: {
                        ...filters[filterName],
                        value: newFilter
                    }
                }
            })

        } catch (e) {
            console.warn('Invalid filter', event?.target?.value);
        }
    }

    const closeFilterDialogs = () => {
        setActiveFilterDialogIndex(null);
    }

    const changeSortDirection = (direction, column) => {
        console.log('direction,column', direction,column)
        setSortDirections(sortDirections => ({
            ...sortDirections,
            [column]: direction
        }));
        setSortingColumn(column);
    }

    const newHeaders = headers.map((header, index) => {
        const isFiltered = filters?.[header.field] ? filters?.[header.field].value.toString().substring(0, 6) !== '/(?:)/' : false;
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
            )
        }
    });

    const transformedData = data.filter(row => {
        return headers.reduce((prevBool, header) => {
            return prevBool && filters[header.field]?.value?.test(row[header.field]);
        }, true);
    }).sort((row1, row2) => {
        /** No sorting */
        const sortDirection = sortDirections[sortingColumn];
        if (sortDirection === UNSORTED) return 0;

        /** No sorting column */
        if (!sortingColumn) return 0;

        /** No cell value */
        const value1 = row1?.[sortingColumn];
        const value2 = row2?.[sortingColumn];
        if (value1 === undefined || value1 === null) return 0;
        if (value2 === undefined || value2 === null) return 0;


        const sortFactor = sortDirection === ASCENDING ? 1 : -1;
        if (value1 < value2) return -1 * sortFactor;
        if (value1 > value2) return 1 * sortFactor;
        return 0;
    })

    return <SimpleTable data={transformedData} headers={newHeaders} />
}


export default ActionableTable;