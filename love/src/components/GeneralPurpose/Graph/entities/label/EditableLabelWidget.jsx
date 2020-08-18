import * as React from 'react';
import styles from './EditableLabelWidget.module.css';

export const EditableLabelWidget = (props) => {
  if (props.model.value === undefined) {
    return null;
  }

  return typeof props.model.value === 'string' ? (
    <div className={styles.tooltipContainer}>{props.model.value}</div>
  ) : (
    props.model.value
  );
};
