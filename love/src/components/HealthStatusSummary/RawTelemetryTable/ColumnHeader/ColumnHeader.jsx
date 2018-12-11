import React, { Component } from 'react'
import styles from './ColumnHeader.module.css'
// import FilterIcon from '../../../icons/FilterIcon/FilterIcon';
import FilterButton from './FilterButton/FilterButton';
import FilterDialog from '../FilterDialog/FilterDialog';

export default class ColumnHeader extends Component {

    render() {
        const isActive = this.props.activeFilterDialog===this.props.filterName;
        const isFiltered = this.props.filter.value.toString().substring(0,6)!== '/(?:)/';
        const sortDirection = this.props.sortingColumn === this.props.filterName ? this.props.sortDirection : ''; 
        return(
            <th className={this.props.className}> 
                <div className={styles.columnHeader}>
                    <span className={styles.primaryText}>{this.props.header}</span> 
                    <span className={styles.secondaryText}>{this.props.secondaryText}</span>
                    <FilterButton filterName={this.props.filterName} 
                                selected={isActive}
                                isFiltered={isFiltered}
                                columnOnClick={this.props.columnOnClick}
                                sortDirection={sortDirection}/>
                </div> 
                <FilterDialog 
                    show={isActive}
                    changeFilter={this.props.changeFilter(this.props.filterName)}
                    closeFilterDialogs={this.props.closeFilterDialogs}
                    changeSortDirection={this.props.changeSortDirection}
                    columnName={this.props.filterName}/> 
            </th>
        );
    }

}