/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

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

import { Component } from 'react';
import RightArrowIcon from 'components/icons/RightArrowIcon/RightArrowIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';
import styles from './Filters.module.css';

export default class Filters extends Component {
  renderingFilters() {
    const { filterToMount, filterToUnmount } = this.props;
    const listFilters = ['u', 'g', 'r', 'i', 'z', 'y'];
    return listFilters.map((f, i) => {
      if (filterToMount === f) {
        return (
          <div key={i} className={styles.filterToMountStyle}>
            {f}
          </div>
        );
      } else if (filterToUnmount === f) {
        return (
          <div key={i} className={styles.filterToUnmountStyle}>
            {f}
          </div>
        );
      } else {
        return (
          <div key={i} className={styles.disabledFilter}>
            {f}
          </div>
        );
      }
    });
  }

  render() {
    const { needSwap, filterToMount, filterToUnmount } = this.props;
    return (
      <div className={styles.container}>
        {needSwap ? (
          <div className={styles.panel}>
            <div className={styles.viewSwapNeeded}>
              <span>
                <span className={styles.filterText}>Filter</span> Swap Needed
              </span>
              <WarningIcon className={styles.iconWarning} />
            </div>
            <div className={styles.swap}>
              <div className={styles.filterToUnmountStyle}>{filterToUnmount}</div>
              <div className={styles.iconArrow}>
                <RightArrowIcon />
              </div>
              <div className={styles.filterToMountStyle}>{filterToMount}</div>
            </div>
          </div>
        ) : (
          <div className={styles.panel}>
            <h3 className={styles.title}>Filter</h3>
            <div className={styles.separator}></div>
            <div className={styles.filters}>{this.renderingFilters()}</div>
          </div>
        )}
      </div>
    );
  }
}
