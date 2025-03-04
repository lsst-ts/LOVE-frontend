/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Summary from './Summary/Summary';
import Actuators from './Actuators/Actuators';
import styles from './M2.module.css';

export default class M2 extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,

    /** Current summary state of the CSC. High level state machine state identifier. */
    summaryState: PropTypes.number,
    /** Can the commandable SAL component (CSC) control the MTM2?
     * If true the CSC can control the MTM2; else the Engineering User Interface has control. */
    commandableByDDS: PropTypes.bool,
    /** The status of force balance (FB) system (on or off). */
    forceBalanceSystemStatus: PropTypes.bool,
    /** Indicates when all of the M2 axes are within tolerance of the target positions.
     * True if the M2 assembly is in position.*/
    m2AssemblyInPosition: PropTypes.bool,

    /** Zenith angle is 0 degree when the telescope is at zenith. */
    zenithAngleMeasured: PropTypes.number,
    /** The source of inclination telemetry (onboard or from main telescope mount (MTMount) control system). */
    inclinationTelemetrySource: PropTypes.number,
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

    /** M2 power system type */
    powerType: PropTypes.number,
    /** M2 power system state */
    powerState: PropTypes.number,

    /** Number of the minimum force limit, used for the gradiant color */
    minForceLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxForceLimit: PropTypes.number,
  };

  static defaultProps = {
    minForceLimit: 0,
    maxForceLimit: 1000,
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const {
      actuatorIlcState,
      axialActuatorSteps,
      axialEncoderPositions,
      axialForceApplied,
      axialForceMeasured,
      commandableByDDS,
      forceBalanceSystemStatus,
      inclinationTelemetrySource,
      m2AssemblyInPosition,
      tangentActuatorSteps,
      tangentEncoderPositions,
      tangentForceApplied,
      tangentForceMeasured,
      minForceLimit,
      maxForceLimit,
      alignment,
      powerType,
      powerState,
      summaryState,
      zenithAngleMeasured,
    } = this.props;

    return (
      <div className={styles.container}>
        <Summary
          summaryState={summaryState}
          commandableByDDS={commandableByDDS}
          forceBalanceSystemStatus={forceBalanceSystemStatus}
          m2AssemblyInPosition={m2AssemblyInPosition}
          alignment={alignment}
          powerType={powerType}
          powerState={powerState}
        />

        <Actuators
          zenithAngleMeasured={zenithAngleMeasured}
          inclinationTelemetrySource={inclinationTelemetrySource}
          actuatorIlcState={actuatorIlcState}
          axialActuatorSteps={axialActuatorSteps}
          axialEncoderPositions={axialEncoderPositions}
          axialForceApplied={axialForceApplied}
          axialForceMeasured={axialForceMeasured}
          tangentActuatorSteps={tangentActuatorSteps}
          tangentEncoderPositions={tangentEncoderPositions}
          tangentForceApplied={tangentForceApplied}
          tangentForceMeasured={tangentForceMeasured}
          minForceLimit={minForceLimit}
          maxForceLimit={maxForceLimit}
        />
      </div>
    );
  }
}
