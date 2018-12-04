import React, { Component } from 'react'
import styles from './ColumnHeader.module.css'
import FilterIcon from '../../../icons/FilterIcon/FilterIcon';
import FilterDialog from '../FilterDialog/FilterDialog';

export default class ColumnHeader extends Component {

    render() {
        return(
            <th key={this.props.header}> 
                <div className={styles.columnHeader}>
                    {this.props.header} 
                    
                    <div className={styles.filterIconWrapper}>
                        <FilterIcon filterName={this.props.filterName} onClickHandler={this.props.columnOnClick}/>
                    </div>
                </div> 
                <div>
                    <FilterDialog 
                        show={this.props.activeFilterDialog===this.props.filterName}
                        changeFilter={this.props.changeFilter(this.props.filterName)}/> 
                </div>
            </th>
        );
    }

}