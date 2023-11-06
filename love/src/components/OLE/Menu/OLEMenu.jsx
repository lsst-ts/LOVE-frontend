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

import React from 'react';
import PropTypes from 'prop-types';
import styles from './OLEMenu.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';

/** Contents of the User details Dropdown Menu */
const OLEMenu = ({ newNarrativeLogClick, newExposureLogClick, newTMALogClick }) => {
  return (
    <>
      <div className={styles.menuElement}>
        <span className={styles.title}>OLE</span>
      </div>
      <div className={styles.divider}></div>
      <div className={[styles.menuElement, styles.highlight].join(' ')} onClick={newNarrativeLogClick}>
        <div className={styles.smallIconRow}>
          <AddIcon className={styles.addIcon} />
          <span>New Narrative Log</span>
        </div>
      </div>
      <div className={[styles.menuElement, styles.highlight].join(' ')} onClick={newExposureLogClick}>
        <div className={styles.smallIconRow}>
          <AddIcon className={styles.addIcon} />
          <span>New Exposure Log</span>
        </div>
      </div>
      <div className={[styles.menuElement, styles.highlight].join(' ')} onClick={newTMALogClick}>
        <div className={styles.smallIconRow}>
          <AddIcon className={styles.addIcon} />
          <span>New TMA Log</span>
        </div>
      </div>
    </>
  );
};

OLEMenu.propTypes = {
  /** Function to handle the click on the new Narrative Log option */
  newNarrativeLogClick: PropTypes.func,
  /** Function to handle the click on the new Exposure Log option */
  newExposureLogClick: PropTypes.func,
  /** Function to handle the click on the new TMA Log option */
  newTMALogClick: PropTypes.func,
};

export default OLEMenu;
