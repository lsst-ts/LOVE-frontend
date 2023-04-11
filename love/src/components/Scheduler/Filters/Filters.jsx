import React, { Component } from 'react';
import styles from './Filters.module.css';
import RightArrowIcon from 'components/icons/RightArrowIcon/RightArrowIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';

export default class Filters extends Component {
  render() {
    const { needSwap, filterToMount, filterToUnmount } = this.props;
    return (
      <div className={styles.container}>
        {needSwap ?
          (<div>
            <div className={styles.viewSwapNeeded}>
              <span><span className={styles.filterText}>Filter</span> Swap Needed</span>
              <WarningIcon className={styles.iconWarning}/>
            </div>
            <div className={styles.swap}>
              <div className={styles.filter}>{filterToUnmount}</div>
              <div className={styles.iconArrow}><RightArrowIcon /></div>
              <div className={styles.filter}>{filterToMount}</div>
            </div>
          </div>):
          (<div>
            <h3 className={styles.title}>Filter</h3>
            <div className={styles.separator}></div>
            <div className={styles.filters}>
              <div className={styles.filter}>u</div>
              <div className={styles.filter}>g</div>
              <div className={styles.filter}>r</div>
              <div className={styles.filter}>i</div>
              <div className={styles.filter}>z</div>
              <div className={styles.filter}>y</div>
            </div>
          </div>)}
      </div>
    );
  }
}
