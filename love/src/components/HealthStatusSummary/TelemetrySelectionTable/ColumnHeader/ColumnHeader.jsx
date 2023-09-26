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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ColumnHeader.module.css';
// import FilterIcon from '../../../icons/FilterIcon/FilterIcon';
import FilterButton from './FilterButton/FilterButton';
import FilterDialog from '../FilterDialog/FilterDialog';

export default class ColumnHeader extends Component {
  static propTypes = {
    activeFilterDialog: PropTypes.string,
    filterName: PropTypes.string,
    filter: PropTypes.object,
    sortingColumn: PropTypes.string,
    sortDirection: PropTypes.string,
    className: PropTypes.string,
    header: PropTypes.string,
    secondaryText: PropTypes.string,
    columnOnClick: PropTypes.func,
    changeFilter: PropTypes.func,
    closeFilterDialogs: PropTypes.func,
    changeSortDirection: PropTypes.func,
  };

  render() {
    const isActive = this.props.activeFilterDialog === this.props.filterName;
    const isFiltered = this.props.filter.value.toString().substring(0, 6) !== '/(?:)/';
    const sortDirection = this.props.sortingColumn === this.props.filterName ? this.props.sortDirection : '';
    return (
      <th className={this.props.className}>
        <div className={styles.columnHeader}>
          <span className={styles.primaryText}>{this.props.header}</span>
          <span className={styles.secondaryText}>{this.props.secondaryText}</span>
          <FilterButton
            filterName={this.props.filterName}
            selected={isActive}
            isFiltered={isFiltered}
            columnOnClick={this.props.columnOnClick}
            sortDirection={sortDirection}
          />
        </div>
        <FilterDialog
          show={isActive}
          changeFilter={this.props.changeFilter(this.props.filterName)}
          closeFilterDialogs={this.props.closeFilterDialogs}
          changeSortDirection={this.props.changeSortDirection}
          columnName={this.props.filterName}
          sortingColumn={this.props.sortingColumn}
        />
      </th>
    );
  }
}
