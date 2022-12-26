import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mtCameraRaftDetailedStateMap, mtCameraRaftDetailedStateToStyle } from 'Config';
import styles from './FocalPlane.module.css';

class FocalPlane extends Component {
  constructor() {
    super();
    this.state = {};
  }

  renderRaft(raft) {
    const { selectedRaft, setHoveredRaft, setSelectedRaft } = this.props;
    const { id, status, ccds } = raft;
    const borderColor = this.getColors(mtCameraRaftDetailedStateToStyle[mtCameraRaftDetailedStateMap[status]]);
    return (
      <div
        key={`Raft-${id}`}
        style={{ border: selectedRaft?.id === id ? '2px solid white' : `2px solid ${borderColor}` }}
        className={styles.raftContainer}
        onClick={() => setSelectedRaft(raft)}
        onMouseOver={() => setHoveredRaft(raft)}
      >
        {ccds.map((ccd) => this.renderCCD(ccd))}
      </div>
    );
  }

  renderCCD(ccd) {
    const { id, status } = ccd;
    const bgColor = this.getColors(mtCameraRaftDetailedStateToStyle[mtCameraRaftDetailedStateMap[status]]);
    return <div key={`CCD-${id}`} style={{ backgroundColor: bgColor }} className={styles.ccdContainer} />;
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
