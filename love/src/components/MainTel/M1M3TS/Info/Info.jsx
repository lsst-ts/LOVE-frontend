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
    selectedSensor: PropTypes.number,
    enabledFCU: PropTypes.arrayOf(PropTypes.bool),
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    fanRPM: PropTypes.arrayOf(PropTypes.number),
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
      enabledFCU,
      absoluteTemperature,
      differentialTemperature,
      fanRPM,
    } = this.props;

    const sensorIndex = sensorReferenceId.indexOf(id);
    const enabledData = enabledFCU[sensorIndex] ? 1 : 0;
    const enabledState = m1m3tsEnabledStateMap[enabledData];

    const sensor = {
      id: `FCU${String(id).padStart(2, '0')}`,
      absoluteTemperature: absoluteTemperature[sensorIndex] ?? 0,
      differentialTemperature: differentialTemperature[sensorIndex] ?? 0,
      fanRPM: fanRPM[sensorIndex] ?? 0,
    };

    sensor.state = {
      enabled: {
        name: enabledState,
        status: m1m3tsEnabledStateToStyle[enabledState ?? 0],
      }
    };
  
    return sensor;
  }

  render() {
    const selectedSensorID = this.props.selectedSensor ?? Info.defaultProps.selectedSensor;
    let selectedSensorData = this.getSensor(selectedSensorID);

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
            <Value>{`${defaultNumberFormatter(selectedSensorData.fanRPM)} RPM`}</Value>

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
