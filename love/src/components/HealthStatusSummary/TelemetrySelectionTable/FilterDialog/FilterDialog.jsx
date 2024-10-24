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
import styles from './FilterDialog.module.css';
import FilterIcon from '../../../icons/FilterIcon/FilterIcon';
import ArrowIcon from '../../../icons/ArrowIcon/ArrowIcon';
import TextField from '../../../TextField/TextField';

export const ASCENDING = 'ascending';
export const DESCENDING = 'descending';
export const UNSORTED = 'None';

export default class FilterDialog extends Component {
  static propTypes = {
    show: PropTypes.bool,
    columnName: PropTypes.string,
    sortingColumn: PropTypes.string,
    changeSortDirection: PropTypes.func,
    closeFilterDialogs: PropTypes.func,
    changeFilter: PropTypes.func,
    ascendingSortLabel: PropTypes.node,
    descendingSortLabel: PropTypes.node,
  };

  static defaultProps = {
    ascendingSortLabel: 'A - Z',
    descendingSortLabel: 'Z - A',
  };

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
  }

  componentDidUpdate = () => {
    this.textInput.current.focus();
  };

  shouldComponentUpdate = (nextProps) => nextProps.show !== this.props.show;

  sortAscending = () => {
    this.props.changeSortDirection(ASCENDING, this.props.columnName);
    this.props.closeFilterDialogs();
  };

  sortDescending = () => {
    this.props.changeSortDirection(DESCENDING, this.props.columnName);
    this.props.closeFilterDialogs();
  };

  onInputKeyUp = (ev) => {
    if (ev.key === 'Enter') {
      this.props.closeFilterDialogs();
    }
    if (ev.key === 'Escape') {
      this.props.closeFilterDialogs();
      // ev.target.value = '';
      this.props.changeFilter({ target: '' });
    }
  };

  clearAllOnClick = () => {
    this.textInput.current.value = '';
    this.props.changeFilter({ target: '' });
    if (this.props.columnName === this.props.sortingColumn) {
      this.props.changeSortDirection(UNSORTED, this.props.columnName);
    }
    this.props.closeFilterDialogs();
  };

  render() {
    return (
      <div className={styles.superContainer}>
        <div
          ref={this.container}
          className={`${styles.filterContainer} ${this.props.show ? styles.show : styles.hide}`}
        >
          <div className={styles.dialogRowTitle}>
            <div className={styles.filterIconWrapper}>
              <FilterIcon />
            </div>
            <span className={styles.filterText}>Sort as...</span>
            <span className={styles.clearAll} onClick={this.clearAllOnClick}>
              Clear all
            </span>
          </div>
          <div onClick={this.sortAscending} className={styles.dialogRow}>
            <div className={styles.filterIconWrapper}>
              <ArrowIcon active={false} up />
            </div>
            <span className={styles.sortOption}>{this.props.ascendingSortLabel}</span>
          </div>
          <div onClick={this.sortDescending} className={styles.dialogRow}>
            <div className={styles.filterIconWrapper}>
              <ArrowIcon active={false} />
            </div>
            <span className={styles.sortOption}>{this.props.descendingSortLabel}</span>
          </div>

          <div className={styles.line}> </div>
          <div className={styles.dialogRowTitle}>
            <div className={styles.filterIconWrapper}>
              <FilterIcon active={false} isFiltered />
            </div>
            <span className={styles.filterText}>Filter...</span>
          </div>
          <TextField ref={this.textInput} onChange={this.props.changeFilter} onKeyUp={this.onInputKeyUp} />
        </div>
      </div>
    );
  }
}
