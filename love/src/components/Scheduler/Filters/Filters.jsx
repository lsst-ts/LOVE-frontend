import React, { Component } from 'react';
import styles from './Filters.module.css';
import RightArrowIcon from 'components/icons/RightArrowIcon/RightArrowIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';

export default class Filters extends Component {
  renderingFilters() {
    const { filterToMount, filterToUnmount } = this.props;
    const listFilters = ['u', 'g', 'r', 'i', 'z', 'y'];
    const filterStyle = {};
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
