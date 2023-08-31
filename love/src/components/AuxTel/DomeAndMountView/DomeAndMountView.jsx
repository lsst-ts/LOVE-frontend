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
import DomeContainer from '../Dome/Dome.container';
import Panel from '../../GeneralPurpose/Panel/Panel';
import Mount from '../Mount/Mount';
import styles from './DomeAndMountView.module.css';

export default class DomeAndMountView extends Component {
  render() {
    return (
      <div className={styles.mainGrid}>
        <div className={styles.statusGrid}></div>
        <div className={styles.domeGrid}>
          <Panel title="Dome and Mount view" className={styles.panel}>
            <div className={styles.domeContainer}>
              <DomeContainer width={400} height={400} />
            </div>
          </Panel>
        </div>
        <div className={styles.mountGrid}>
          <Panel title="Mount detailed view" className={styles.panel}>
            <div className={styles.mountContainerWrapper}>
              <div className={styles.mountContainer}>
                <Mount />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
