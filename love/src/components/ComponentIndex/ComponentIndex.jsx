/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import { Link } from 'react-router-dom';
import styles from './ComponentIndex.module.css';

export default class ComponentIndex extends Component {
  static propTypes = {
    /** Function to log oput of the app */
    logout: PropTypes.func,
  };

  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Component index</h1>
        <ol className={styles.linkList}>
          <li className={styles.linkListItem}>
            <Link to="/health-status-summary">Health status summary</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/dm-flow">Data Management Flow</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/time-series">Time Series</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/script-queue-1">Script Queue 1</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/script-queue-2">Script Queue 2</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/csc-summary">CSC Summary</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/auxiliary-telescope">Auxiliary Telescope</Link>
            <ul className={styles.linkListSubItem}>
              <Link to="/aux-tel-dome-and-mount">Dome & Mount</Link>
            </ul>
            <ul className={styles.linkListSubItem}>
              <Link to="/aux-tel-dome">Dome</Link>
            </ul>
            <ul className={styles.linkListSubItem}>
              <Link to="/aux-tel-mount">Mount</Link>
            </ul>
            <ul className={styles.linkListSubItem}>
              <Link to="/latiss">LATISS</Link>
            </ul>
            <ul className={styles.linkListSubItem}>
              <Link to="/aux-tel-camera">Auxiliary Telescope Camera</Link>
            </ul>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/watcher">Watcher</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/generic-camera">Generic Camera</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/uif">UI Framework</Link>
          </li>
        </ol>
      </div>
    );
  }
}
