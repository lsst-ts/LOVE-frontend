import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mtCameraRaftDetailedStateMap, mtCameraRaftDetailedStateToStyle } from 'Config';
import styles from './FocalPlane.module.css';

class FocalPlane extends Component {
  constructor() {
    super();
    this.state = {
      selectedRaft: null,
    };
  }

  selectRaft(id) {
    console.log(id);
    this.setState({ selectedRaft: id });
  }

  renderRaft({ id, status, ccds }) {
    const { selectedRaft } = this.state;
    const borderColor = this.getColors(mtCameraRaftDetailedStateToStyle[mtCameraRaftDetailedStateMap[status]]);
    return (
      <div
        style={{ border: selectedRaft === id ? '2px solid white' : `2px solid ${borderColor}` }}
        className={styles.raftContainer}
        onClick={() => this.selectRaft(id)}
      >
        {ccds.map((ccd) => this.renderCCD(ccd))}
      </div>
    );
  }

  renderCCD({ id, status }) {
    const bgColor = this.getColors(mtCameraRaftDetailedStateToStyle[mtCameraRaftDetailedStateMap[status]]);
    return <div style={{ backgroundColor: bgColor }} className={styles.ccdContainer}></div>;
  }

  getColors(type) {
    switch (type) {
      case 'ok':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'alert':
        return 'red';
      case 'invalid':
        return '';
    }
  }

  render() {
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

    return <div className={styles.raftsContainer}>{rafts.map((raft) => this.renderRaft(raft))}</div>;
  }
}

export default FocalPlane;
