import * as React from 'react';

import { EditableLabelModel } from './EditableLabelModel';
import styled from '@emotion/styled';
import EventLogContainer from 'components/EventLog/EventLog.container';
import styles from './EditableLabelWidget.module.css';

export const EditableLabelWidget = (props) => {
  return typeof props.model.value === 'string' ? (
    <div className={styles.tooltipContainer}>{props.model.value}</div>
  ) : (
    props.model.value
  );
};
