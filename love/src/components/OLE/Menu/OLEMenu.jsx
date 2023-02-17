import React from 'react';
import PropTypes from 'prop-types';
import styles from './OLEMenu.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';


/** Contents of the User details Dropdown Menu */
const OLEMenu = ({
  newNonExposureClick,
  newExposureClick
}) => {
  return (
    <>
      <div className={styles.menuElement}>
        <span className={styles.title}>OLE</span>
      </div>
      <div className={styles.divider}></div>
      <div className={[styles.menuElement, styles.highlight].join(" ")}
        onClick={newNonExposureClick}
      >
        <div className={styles.smallIconRow}>
          <AddIcon className={styles.addIcon} />
          <span>New Narrative Log</span>
        </div>
      </div>
      <div className={[styles.menuElement, styles.highlight].join(" ")}
        onClick={newExposureClick}
      >
        <div className={styles.smallIconRow}>
          <AddIcon className={styles.addIcon} />
          <span>New Exposure Log</span>
        </div>
      </div>
    </>
  )
}

export default OLEMenu;