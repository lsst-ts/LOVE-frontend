import React, { Component } from 'react'
import styles from './ColumnHeader.module.css'
import FilterIcon from '../../../icons/FilterIcon/FilterIcon';
import FilterDialog from '../FilterDialog/FilterDialog';

export default class ColumnHeader extends Component {

    render() {
        const isActive = this.props.activeFilterDialog===this.props.filterName;
        const isFiltered = this.props.filter.value.toString().substring(0,6)!== '/(?:)/';

        return(
            <th > 
                <div className={styles.columnHeader}>
                    <span className={styles.primaryText}>{this.props.header}</span> 
                    <span className={styles.secondaryText}>{this.props.secondaryText}</span>
                    <div className={styles.filterIconWrapper}>
                        <FilterIcon filterName={this.props.filterName} 
                                    onClickHandler={this.props.columnOnClick} 
                                    active={isActive}
                                    isFiltered={isFiltered}/>
                    </div>
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