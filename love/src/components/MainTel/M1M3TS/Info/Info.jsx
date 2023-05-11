import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultNumberFormatter } from 'Utils';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import styles from './Info.module.css';
import {
  m1m3tsActuatorILCStateMap,
  m1m3tsEnabledStateMap,
  mtm1m3tsFanBreakerStateMap,
  mtm1m3HeaterDisabledStateMap,
  m1m3tsEnabledStateToStyle,
  m1m3tsILCStateToStyle,
  mtm1m3tsFanBreakerStateToStyle,
  mtm1m3tsHeaterDisabledStateToStyle,
  M1M3TSFanCoilPositions,
  MessagesWarningM1M3ThermalSystem,
} from 'Config';

export default class Info extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Id of sensor selected */
    selectedSensor: PropTypes.number,
    /** True if this fan unit is enabled. */
    // enabled: PropTypes.arrayOf(PropTypes.bool),
    /** Thermal status response data. Absolute temperature. */
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Differential temperature. */
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Measured fan RPM-0 to 2550 RPM. */
    fanRPM: PropTypes.arrayOf(PropTypes.number),
    /** Object with boolean arrays for indicates of warning. */
    thermalWarnings: PropTypes.object,
  };

  static defaultProps = {
    sensorReferenceId: [],
    selectedSensor: undefined,
    // enabled: [],
    absoluteTemperature: [],
    differentialTemperature: [],
    fanRPM: [],
    thermalWarnings: {},
  };

  getThermalWarnings = (sensorIndex) => {
    const { thermalWarnings } = this.props;

    const warnings = Object.keys(thermalWarnings)
      .map((key, _) => ({
        name: key,
        value: thermalWarnings[key][sensorIndex],
        msg: MessagesWarningM1M3ThermalSystem[key],
      }))
      .filter((warning) => warning.value === true);

    return warnings;
  };

  getSensor = (id) => {
    if (id === undefined) return { id: 'None', value: 'None', state: CSCDetail.states[0] };

    const {
      sensorReferenceId,
      ilcFCU,
      // enabled,
      absoluteTemperature,
      differentialTemperature,
      fanRPM,
      fanBreaker,
      heaterDisabled,
    } = this.props;

    const fcuIndex = M1M3TSFanCoilPositions.findIndex((fcu) => fcu.id === id);
    const sensorIndex = sensorReferenceId.indexOf(fcuIndex);

    // const enabledData = enabled[sensorIndex];
    // const enabledState = m1m3tsEnabledStateMap[enabledData];

    const ilcData = ilcFCU[sensorIndex];
    const ilcState = m1m3tsActuatorILCStateMap[ilcData];

    const fanBreakerData = fanBreaker[sensorIndex];
    const fanBreakerState = mtm1m3tsFanBreakerStateMap[fanBreakerData];

    const heaterDisabledData = heaterDisabled[sensorIndex];
    const heaterDisabledState = mtm1m3HeaterDisabledStateMap[heaterDisabledData];

    const warnings = this.getThermalWarnings(sensorIndex);

    const sensor = {
      index: sensorIndex,
      name: `FCU${String(id).padStart(2, '0')}`,
      absoluteTemperature: absoluteTemperature[sensorIndex] ?? 0,
      differentialTemperature: differentialTemperature[sensorIndex] ?? 0,
      fanRPM: fanRPM[sensorIndex] ?? 0,
      fanBreaker: fanBreaker[sensorIndex] ?? false,
      heaterDisabled: heaterDisabled[sensorIndex] ?? false,
      state: {
        ilc: {
          name: ilcState,
          status: m1m3tsILCStateToStyle[ilcState],
        },
        // enabled: {
        //   name: enabledState,
        //   status: m1m3tsEnabledStateToStyle[enabledState],
        // },
        fanBreaker: {
          name: fanBreakerState,
          status: mtm1m3tsFanBreakerStateToStyle[fanBreakerState],
        },
        heaterDisabled: {
          name: heaterDisabledState,
          status: mtm1m3tsHeaterDisabledStateToStyle[heaterDisabledState],
        },
      },
      warnings,
    };

    return sensor;
  };

  render() {
    const selectedSensorID = this.props.selectedSensor ?? Info.defaultProps.selectedSensor;
    let selectedSensorData = this.getSensor(selectedSensorID);

    return (
      <SummaryPanel className={styles.info}>
        {selectedSensorID ? (
          <>
            <Title>{selectedSensorData.name}</Title>
            <Value>
              <StatusText status={selectedSensorData.state.ilc.status}>{selectedSensorData.state.ilc.name}</StatusText>
            </Value>

            <Title>Fan Breaker</Title>
            <Value>
              <StatusText status={selectedSensorData.state.fanBreaker.status}>
                {selectedSensorData.state.fanBreaker.name}
              </StatusText>
            </Value>

            <Title>Heater Disabled</Title>
            <Value>
              <StatusText status={selectedSensorData.state.heaterDisabled.status}>
                {selectedSensorData.state.heaterDisabled.name}
              </StatusText>
            </Value>

            <Label>Absolute Temperature</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.absoluteTemperature)} C°`}</Value>

            <Label>Differential Temperature</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.differentialTemperature)} C°`}</Value>

            <Label>Fan</Label>
            <Value>{`${defaultNumberFormatter(selectedSensorData.fanRPM)} RPM`}</Value>

            {selectedSensorData.warnings.length > 0 && (
              <>
                <div className={styles.separator}></div>
                <Title>Warnings</Title>
                <span className={styles.warningIcon}>
                  <WarningIcon></WarningIcon>
                </span>

                <div className={styles.warningContainer}>
                  {selectedSensorData.warnings.map((warning) => {
                    return (
                      <span key={warning.name} className={styles.warningText}>
                        {warning.msg}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={styles.noSensor}>No FCU selected</div>
        )}
      </SummaryPanel>
    );
  }
}
