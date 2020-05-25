import React from 'react';
import SimpleTable from '../SimpleTable/SimpleTable';
import styles from './ActionableTable.module.css';
import FilterButton from '../../HealthStatusSummary/TelemetrySelectionTable/ColumnHeader/FilterButton/FilterButton';
import FilterDialog from '../../HealthStatusSummary/TelemetrySelectionTable/FilterDialog/FilterDialog';


/**
 * A table that can run actions over its data such as
 * sorting and filtering from a dialog in its column header.
 * Default actions are sorting and filtering but can be overwritten.
 */
const ActionableTable = function ({ data, headers }) {

    const [activeFilterDialogIndex, setActiveFilterDialogIndex] = React.useState(null);
    const [filters, setFilters] = React.useState({});

    React.useEffect(() => {
        const initialFilters = headers.reduce((prevDict, header) => {
            prevDict[header.field] = {
                type: 'regexp',
                value: new RegExp('(?:)')
            }
            return prevDict;
        }, {});
        setFilters(initialFilters);
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

    const newHeaders = headers.map((header, index) => {

        const sortDirection = 'ascending';
        const isFiltered = filters?.[header.field] ? filters?.[header.field].value.toString().substring(0, 6) !== '/(?:)/' : false;
        /** To set no active filter dialog */
        const closeFilterDialogs = () => console.log('adsfsadf')

        const changeSortDirection = (direction, column) => console.log('direction, column', direction, column);

        const sortingColumn = `filterName-0`;

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
                        sortDirection={sortDirection}
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
            console.log(header.field, filters[header.field]?.value?.test(row[header.field]))
            return prevBool && filters[header.field]?.value?.test(row[header.field]);
        }, true);
    })

    return <SimpleTable data={transformedData} headers={newHeaders} />
}


export default ActionableTable;