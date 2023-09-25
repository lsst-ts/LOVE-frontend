/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ccCameraRaftDetailedStateMap, ccCameraRaftDetailedStateToStyle } from 'Config';
import styles from './FocalPlane.module.css';

class FocalPlane extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRaft(raft) {
    const { selectedRaft, setHoveredRaft, setSelectedRaft } = this.props;
    const { id, status, ccds } = raft;
    const borderColor = this.getColors(ccCameraRaftDetailedStateToStyle[ccCameraRaftDetailedStateMap[status]]);
    return (
      <div
        key={`Raft-${id}`}
        // style={{ border: selectedRaft?.id === id ? '1px solid white' : `2px solid ${borderColor}` }}
        style={{ border: selectedRaft?.id === id ? '1px solid white' : `none` }}
        className={styles.raftContainer}
        onClick={() => setSelectedRaft(raft)}
        onMouseOver={() => setHoveredRaft(raft)}
      >
        {ccds.map((ccd) => this.renderCCD(ccd))}
      </div>
    );
  }

  renderCCD(ccd) {
    const { id, status, unused } = ccd;
    const bgColor = this.getColors(ccCameraRaftDetailedStateToStyle[ccCameraRaftDetailedStateMap[status]]);
    return (
      <div
        key={`CCD-${id}`}
        style={{ backgroundColor: bgColor }}
        className={[styles.ccdContainer, unused ? styles.unusedCCD : ''].join(' ')}
      />
    );
  }

  getColors(type) {
    switch (type) {
      case 'ok':
        return 'var(--status-ok-dimmed-color-2)';
      case 'warning':
        return 'var(--status-warning-dimmed-color-2)';
      case 'alert':
        return 'var(--status-alert-dimmed-color-2)';
      case 'invalid':
        return '';
    }
  }

  render() {
    const { rafts } = this.props;
    return <div className={styles.raftsContainer}>{rafts.map((raft) => this.renderRaft(raft))}</div>;
  }
}

export default FocalPlane;
