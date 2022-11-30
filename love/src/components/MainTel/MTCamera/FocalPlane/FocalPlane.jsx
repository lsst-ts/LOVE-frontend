import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mtCameraRaftDetailedStateMap, mtCameraRaftDetailedStateToStyle } from 'Config';
import styles from './FocalPlane.module.css';

const rafts = [];
const secondaryRafts = [0, 4, 20, 24];
for (let i = 0; i < 25; i++) {
  const ccds = [];
  if (!secondaryRafts.includes(i)) {
    for (let j = 0; j < 9; j++) {
      ccds.push({
        id: i * 9 + (j + 1),
        status: Math.ceil(Math.random() * 3),
      });
    }
  }
  rafts.push({ id: i + 1, status: 1, ccds });
}

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
        style={{ border: selectedRaft === id ? '2px solid white' : `2px solid ${borderColor}` }}
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
    return <div style={{ backgroundColor: bgColor }} className={styles.ccdContainer} />;
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
    return <div className={styles.raftsContainer}>{rafts.map((raft) => this.renderRaft(raft))}</div>;
  }
}

export default FocalPlane;
