import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultNumberFormatter } from 'Utils';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import styles from './Info.module.css';
import { m1m3tsEnabledStateMap, m1m3tsEnabledStateToStyle } from 'Config';


export default class Info extends Component {
  static propTypes = {
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    sensorEnabledState: PropTypes.arrayOf(PropTypes.number),
    selectedSensor: PropTypes.number,
  };

  static defaultProps = {
    sensorReferenceId: [],
    sensorEnabledState: [],
    selectedSensor: 1,
  };

  getSensor = (id) => {
    if (id === 0) return { id: 'None', value: 'None', state: CSCDetail.states[0] };

    const {
      sensorReferenceId,
      sensorEnabledState,
    } = this.props;

    console.log('sensorReferenceId', sensorReferenceId);
    console.log('sensorEnabledState', sensorEnabledState);

    const sensorIndex = sensorReferenceId.indexOf(id);
    console.log('index', sensorIndex);
    const enabledData = sensorEnabledState[sensorIndex];
    const enabledState = m1m3tsEnabledStateMap[enabledData];

    console.log('enabledData', enabledData);
    console.log('enabledState', enabledState);


    console.log('m1m3tsEnabledStateMap', m1m3tsEnabledStateMap);
    console.log('m1m3tsEnabledStateToStyle', m1m3tsEnabledStateToStyle);

    const sensor = {
      id: `FCU${String(id).padStart(2, '0')}`,
    };

    sensor.state = {
      enabled: {
        name: enabledState,
        status: m1m3tsEnabledStateToStyle[enabledState ?? 0],
      }
    }
  
    return sensor;
  }


  render() {
    const selectedSensorID = this.props.selectedSensor ?? Info.defaultProps.selectedSensor;
    let selectedSensorData = this.getSensor(selectedSensorID);

    console.log('render', selectedSensorData);
    return (
      <SummaryPanel className={styles.info}>
        {selectedSensorID ? (
          <>
            <Title>{selectedSensorData.id}</Title>
            <Value>
              <StatusText status={selectedSensorData.state.enabled.status}>
                {selectedSensorData.state.enabled.name}
              </StatusText>
            </Value>

            <Label>Absolute Temperature</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.absoluteTemperature)} C°`}</Value>

            <Label>Differential Temperature</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.differentialTemperature)} C°`}</Value>

            <Label>Fan</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.fan)} RPM`}</Value>

            <Title>Warnings</Title>
            <div>ICON</div>

            <Label>Message</Label>
            <div></div>
          </>
        ) : (
          <div className={styles.noSensor}>No FCU selected</div>
        )}
      </SummaryPanel>
    )
  }
}
