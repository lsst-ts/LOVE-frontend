import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Summary from './Summary/Summary';
import Actuators from './Actuators/Actuators';
import styles from './M2.module.css';

export default class M2 extends Component {

  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const { 
      actuatorReferenceId,
      actuatorIlcState,
      axialActuatorSteps,
      axialEncoderPositions,
      axialForceApplied,
      axialForceMeasured,
      tangentActuatorSteps,
      tangentEncoderPositions,
      tangentForceApplied,
      tangentForceMeasured,
    } = this.props;
    const { summaryState, commandableByDDS, forceBalanceSystemStatus, m2AssemblyInPosition } = this.props;
    const { zenithAngleMeasured, inclinationTelemetrySource } = this.props;

    return (
      <div className={styles.container}>
        <Summary
          summaryState={summaryState}
          commandableByDDS={commandableByDDS}
          forceBalanceSystemStatus={forceBalanceSystemStatus}
          m2AssemblyInPosition={m2AssemblyInPosition}  
        />

        <Actuators
          zenithAngleMeasured={zenithAngleMeasured}
          inclinationTelemetrySource={inclinationTelemetrySource}

          actuatorReferenceId={actuatorReferenceId}
          actuatorIlcState={actuatorIlcState}
          axialActuatorSteps={axialActuatorSteps}
          axialEncoderPositions={axialEncoderPositions}
          axialForceApplied={axialForceApplied}
          axialForceMeasured={axialForceMeasured}
          tangentActuatorSteps={tangentActuatorSteps}
          tangentEncoderPositions={tangentEncoderPositions}
          tangentForceApplied={tangentForceApplied}
          tangentForceMeasured={tangentForceMeasured}
          {...this.props}
        />
      </div>
    );
  }
}