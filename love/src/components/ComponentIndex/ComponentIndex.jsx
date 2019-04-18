import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './ComponentIndex.module.css';
import Button from '../Button/Button';

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
            <Link to="/script-queue">Script Queue</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/csc-summary">CSC Summary</Link>
          </li>
          <li className={styles.linkListItem}>
            <Link to="/auxiliary-telescope">Auxiliary Telescope</Link>
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
