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

    const columnOnClick = (ev, index) => {
        if (activeFilterDialogIndex === index) {
            setActiveFilterDialogIndex(null);
            return;
        }

        setActiveFilterDialogIndex(index);
    }


    const newHeaders = headers.map((header, index) => {

        const sortDirection = 'ascending';
        const isFiltered = index === 1;
        const filterName = `filterName-${index}`;

        const changeFilter = (filtername) => () => console.log('changing filter to', filtername);
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
                        filterName={filterName}
                        selected={activeFilterDialogIndex === index}
                        isFiltered={isFiltered}
                        columnOnClick={(ev) => columnOnClick(ev, index)}
                        sortDirection={sortDirection}
                    />
                    <FilterDialog
                        show={activeFilterDialogIndex === index}
                        changeFilter={changeFilter(filterName)}
                        closeFilterDialogs={closeFilterDialogs}
                        changeSortDirection={changeSortDirection}
                        columnName={filterName}
                        sortingColumn={sortingColumn}
                    />
                </div>
            )
        }
    });

    return <SimpleTable data={data} headers={newHeaders} />
}


export default ActionableTable;