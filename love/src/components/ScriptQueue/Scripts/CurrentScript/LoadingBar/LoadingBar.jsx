import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styles from './LoadingBar.module.css'

export default class LoadingBar extends Component {
  static propTypes = {
    percentage: PropTypes.number,
  };
  static defaultProps = {
    percentage: 0,
  };

  render() {
    return (
      <div className={styles.backgroundBar}>
        <div style={{width: (this.props.percentage+'%')}} className={styles.loadedBar}>
          {(this.props.percentage+'%')}
        </div>
      </div>
    )
  }
}
