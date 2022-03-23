import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultNumberFormatter } from 'Utils';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import {
  m2ActuatorILCStateMap,
  m2ActuatorILCStateToStyle,
} from 'Config';
import styles from './Info.module.css';

export default class Info extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    actuatorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Array for the identify of the position in array with an index */
    actuatorTangentReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** ILC status. The elements are the actuator Ids from 1 to 78.
     * The value needs to be transformed from decimal to hexadecimal to understand.
     * The details are in code 67, LTS-346. */
    actuatorIlcState: PropTypes.arrayOf(PropTypes.number),
    /** Array of steps for each axial actuator in sequence. */
    axialActuatorSteps: PropTypes.arrayOf(PropTypes.number),
    /** Encoder position of each axial encoder in sequence. */
    axialEncoderPositions: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    axialForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    axialForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Array of steps for each actuator in sequence. */
    tangentActuatorSteps: PropTypes.arrayOf(PropTypes.number),
    /** Encoder position of each tangent encoder in sequence. */
    tangentEncoderPositions: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    tangentForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    tangentForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Id of actuator selected */
    selectedActuator: PropTypes.number,
    /** Id of actuator tangent selected */
    selectedActuatorTangent: PropTypes.number,
  }

  static defaultProps = {
    actuatorReferenceId: [],
    actuatorTangentReferenceId: [],
    actuatorIlcState: [],
    axialActuatorSteps: [],
    axialEncoderPositions: [],
    axialForceApplied: [],
    axialForceMeasured: [],
    tangentActuatorSteps: [],
    tangentEncoderPositions: [],
    tangentForceApplied: [],
    tangentForceMeasured: [],
    selectedActuator: undefined,
    selectedActuatorTangent: undefined,
  };

  getActuator = (id) => {
    if (id === 0) return { id: 'None', value: 'None', state: CSCDetail.states[0] };
    const {
      actuatorIlcState,
      actuatorReferenceId,
      axialActuatorSteps,
      axialEncoderPositions,
      axialForceApplied,
      axialForceMeasured,
    } = this.props;

    const actuatorIndex = actuatorReferenceId.indexOf(id);

    const actuator = {
      id: `C${String(id).padStart(2, '0')}`,
      actuatorStep: axialActuatorSteps[actuatorIndex] ?? 0,
      encoderPosition: axialEncoderPositions[actuatorIndex] ?? 0,
      forceApplied: axialForceApplied[actuatorIndex] ?? 0,
      forceMeasured: axialForceMeasured[actuatorIndex] ?? 0,
    };
    actuator.state = {
      id: actuatorIlcState[actuatorIndex] ?? 0,
      name: m2ActuatorILCStateMap[actuatorIlcState[actuatorIndex] ?? 0],
      status: m2ActuatorILCStateToStyle[m2ActuatorILCStateMap[actuatorIlcState[actuatorIndex]] ?? 0],
    };
    return actuator;
  };

  getActuatorTangent = (id) => {
    const LEN_ACTUATORS = 72;
    const {
      actuatorIlcState,
      actuatorTangentReferenceId,
      tangentActuatorSteps,
      tangentEncoderPositions,
      tangentForceApplied,
      tangentForceMeasured,
    } = this.props;

    const actuatorIndex = actuatorTangentReferenceId.indexOf(id);

    const actuator = {
      id: `A${id}`,
      actuatorStep: tangentActuatorSteps[actuatorIndex] ?? 0,
      encoderPosition: tangentEncoderPositions[actuatorIndex] ?? 0,
      forceApplied: tangentForceApplied[actuatorIndex] ?? 0,
      forceMeasured: tangentForceMeasured[actuatorIndex] ?? 0,
    };
    actuator.state = {
      id: actuatorIlcState[actuatorIndex + LEN_ACTUATORS] ?? 0,
      name: m2ActuatorILCStateMap[actuatorIlcState[actuatorIndex + LEN_ACTUATORS] ?? 0],
      status: m2ActuatorILCStateToStyle[
        m2ActuatorILCStateMap[actuatorIlcState[actuatorIndex + LEN_ACTUATORS]] ?? 0],
    };
    return actuator;
  }

  render() {
    const selectedActuatorID = this.props.selectedActuator;
    const selectedActuatorTangentID = this.props.selectedActuatorTangent;
    let selectedActuatorData = this.getActuator(selectedActuatorID);
    if (selectedActuatorTangentID !== null) {
      selectedActuatorData = this.getActuatorTangent(selectedActuatorTangentID);
    }

    return (
      <SummaryPanel className={styles.actuatorInfo}>
        { selectedActuatorID || selectedActuatorTangentID
          ? (
            <>
              <Title>Actuator {selectedActuatorData.id}</Title>
              <Value>
                <StatusText
                  title={selectedActuatorData.state.name}
                  status={selectedActuatorData.state.status}
                >
                  {selectedActuatorData.state.name}
                </StatusText>
              </Value>

              <Label>Commanded Force</Label>
              <Value>{`${defaultNumberFormatter(selectedActuatorData.forceApplied)} N`}</Value>

              <Label>Measured Force</Label>
              <Value>{`${defaultNumberFormatter(selectedActuatorData.forceMeasured)} N`}</Value>

              <Label>Actuator Steps</Label>
              <Value>{`${defaultNumberFormatter(selectedActuatorData.actuatorStep)} °`}</Value>

              <Label>Position</Label>
              <Value>{`${defaultNumberFormatter(selectedActuatorData.encoderPosition)} um`}</Value>
            </>)
          : (
              <span>No actuator selected</span>
          )
        }
      </SummaryPanel>
    );
  }
}
