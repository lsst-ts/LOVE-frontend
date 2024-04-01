import React from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.module.css';

function Alert({ type = 'info', children }) {
  return (
    <div className={[styles.alert, styles[`alert-${type}`]].join(' ')} role="alert">
      {children}
    </div>
  );
}

Alert.propTypes = {
  /** Type of alert
   * @default 'info'
   * @options 'info', 'success', 'warning', 'error'
   */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Content of the alert */
  children: PropTypes.node,
};

export default Alert;
