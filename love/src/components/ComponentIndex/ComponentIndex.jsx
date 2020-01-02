import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './ComponentIndex.module.css';
import Button from '../GeneralPurpose/Button/Button';

export default class ComponentIndex extends Component {
  static propTypes = {
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
            <span>UI Framework</span>
            <ul className={styles.linkListItem}>
              <Link to="/custom-view">Custom view</Link>
            </ul>
            <ul className={styles.linkListItem}>
              <Link to="/custom-view-editor">View editor</Link>
            </ul>
            <ul className={styles.linkListItem}>
              <Link to="/view-editor">New View editor</Link>
            </ul>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/login">Login</Link>
          </li>
          <li className={styles.linkListItem}>
            <Button onClick={this.props.logout}>Logout</Button>
          </li>
        </ol>
      </div>
    );
  }
}
