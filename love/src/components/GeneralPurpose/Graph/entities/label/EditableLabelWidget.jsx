import * as React from 'react';

import { EditableLabelModel } from './EditableLabelModel';
import styled from '@emotion/styled';
import EventLogContainer from 'components/EventLog/EventLog.container';
import styles from './EditableLabelWidget.module.css';


export const EditableLabelWidget = (props) => {
    const [str, setStr] = React.useState(props.model.value);

    console.log('widget')
    return (

        <div className={styles.tooltipContainer}>
            custom tooltip
        </div>
    );
};
