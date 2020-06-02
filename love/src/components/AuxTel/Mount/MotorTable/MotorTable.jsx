import React, { Component } from 'react';
import SimpleTable from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import {
  motorDriveStateMap,
  stateToStyleMotorDrive,
  motorBrakeStateMap,
  stateToStyleMotorBrake,
} from '../../../../Config';
import styles from './MotorTable.module.css';

export default class MotorTable extends Component {
  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const {
      measuredMotorVelocity,
      measuredTorque,
      mountEncoders,
      mountMotorEncoders,
      torqueDemand,
      azimuthDrive1Status,
      azimuthDrive2Status,
      elevationDriveStatus,
      nasmyth1DriveStatus,
      nasmyth2DriveStatus,
      m3DriveStatus,
      azimuthBrake1,
      azimuthBrake2,
      elevationBrake,
      nasmyth1Brake,
      nasmyth2Brake,
    } = this.props;
    const data = {
      az1: {
        name: 'Az1',
        angle: mountEncoders.azimuthCalculatedAngle ? mountEncoders.azimuthCalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.azimuthMotor1Velocity
          ? measuredMotorVelocity.azimuthMotor1Velocity.value[0]
          : '-',
        measuredTorque: measuredTorque.azimuthMotor1Torque ? measuredTorque.azimuthMotor1Torque.value[0] : '-',
        torqueDemand: torqueDemand.azimuthMotor1Torque ? torqueDemand.azimuthMotor1Torque.value[0] : '-',
        motorEncoder: mountMotorEncoders.azimuth1Encoder ? mountMotorEncoders.azimuth1Encoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.azimuth1EncoderRaw ? mountMotorEncoders.azimuth1EncoderRaw.value[0] : '-',
        brakeStatus: azimuthBrake1,
        driveStatus: azimuthDrive1Status,
      },
      az2: {
        name: 'Az2',
        angle: mountEncoders.azimuthCalculatedAngle ? mountEncoders.azimuthCalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.azimuthMotor2Velocity
          ? measuredMotorVelocity.azimuthMotor2Velocity.value[0]
          : '-',
        measuredTorque: measuredTorque.azimuthMotor2Torque ? measuredTorque.azimuthMotor2Torque.value[0] : '-',
        torqueDemand: torqueDemand.azimuthMotor2Torque ? torqueDemand.azimuthMotor2Torque.value[0] : '-',
        motorEncoder: mountMotorEncoders.azimuth2Encoder ? mountMotorEncoders.azimuth2Encoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.azimuth2EncoderRaw ? mountMotorEncoders.azimuth2EncoderRaw.value[0] : '-',
        brakeStatus: azimuthBrake2,
        driveStatus: azimuthDrive2Status,
      },
      el: {
        name: 'El',
        angle: mountEncoders.elevationCalculatedAngle ? mountEncoders.elevationCalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.azimuthMotor2Velocity
          ? measuredMotorVelocity.azimuthMotor2Velocity.value[0]
          : '-',
        measuredTorque: measuredTorque.elevationMotorTorque ? measuredTorque.elevationMotorTorque.value[0] : '-',
        torqueDemand: torqueDemand.elevationMotorTorque ? torqueDemand.elevationMotorTorque.value[0] : '-',
        motorEncoder: mountMotorEncoders.elevationEncoder ? mountMotorEncoders.elevationEncoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.elevationEncoderRaw ? mountMotorEncoders.elevationEncoderRaw.value[0] : '-',
        brakeStatus: elevationBrake,
        driveStatus: elevationDriveStatus,
      },
      nas1: {
        name: 'Nas1',
        angle: mountEncoders.nasmyth1CalculatedAngle ? mountEncoders.nasmyth1CalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.nasmyth1MotorVelocity
          ? measuredMotorVelocity.nasmyth1MotorVelocity.value[0]
          : '-',
        measuredTorque: measuredTorque.nasmyth1MotorTorque ? measuredTorque.nasmyth1MotorTorque.value[0] : '-',
        torqueDemand: torqueDemand.nasmyth1MotorTorque ? torqueDemand.nasmyth1MotorTorque.value[0] : '-',
        motorEncoder: mountMotorEncoders.nasmyth1Encoder ? mountMotorEncoders.nasmyth1Encoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.nasmyth1EncoderRaw ? mountMotorEncoders.nasmyth1EncoderRaw.value[0] : '-',
        brakeStatus: nasmyth1Brake,
        driveStatus: nasmyth1DriveStatus,
      },
      nas2: {
        name: 'Nas2',
        angle: mountEncoders.nasmyth2CalculatedAngle ? mountEncoders.nasmyth2CalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.nasmyth2MotorVelocity
          ? measuredMotorVelocity.nasmyth2MotorVelocity.value[0]
          : '-',
        measuredTorque: measuredTorque.nasmyth2MotorTorque ? measuredTorque.nasmyth2MotorTorque.value[0] : '-',
        torqueDemand: torqueDemand.nasmyth2MotorTorque ? torqueDemand.nasmyth2MotorTorque.value[0] : '-',
        motorEncoder: mountMotorEncoders.nasmyth2Encoder ? mountMotorEncoders.nasmyth2Encoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.nasmyth2EncoderRaw ? mountMotorEncoders.nasmyth2EncoderRaw.value[0] : '-',
        brakeStatus: nasmyth2Brake,
        driveStatus: nasmyth2DriveStatus,
      },
      m3: {
        name: 'M3',
        angle: '-',
        velocity: measuredMotorVelocity.m3Velocity ? measuredMotorVelocity.m3Velocity.value[0] : '-',
        measuredTorque: measuredTorque.m3Torque ? measuredTorque.m3Torque.value[0] : '-',
        torqueDemand: torqueDemand.m3Torque ? torqueDemand.m3Torque.value[0] : '-',
        motorEncoder: mountMotorEncoders.m3Encoder ? mountMotorEncoders.m3Encoder.value[0] : '-',
        motorEncoderRaw: mountMotorEncoders.m3EncoderRaw ? mountMotorEncoders.m3EncoderRaw.value[0] : '-',
        brakeStatus: '-',
        driveStatus: m3DriveStatus,
      },
    };

    const simpleTableData = Object.values(data);
    const defaultFormatter = value => {
      if (isNaN(value)) return value;
      return Number.isInteger(value) ? value : value.toFixed(5)
    };

    const headers = [
      {
        field: 'name',
        title: 'Motor'
      },
      {
        field: 'angle',
        title: <>Axis Angle <span className={styles.units}>[deg]</span></>,
        type: 'number',
        formatter: (value) => isNaN(value) || Number.isInteger(value) ? value : `${value.toFixed(5)}º`
      },
      {
        field: 'velocity',
        title: <>Velocity <span className={styles.units}>[deg/s]</span></>,
        type: 'number',
        formatter: defaultFormatter
      },
      {
        field: 'measuredTorque',
        title: <>Meas. Torque <span className={styles.units}>[A]</span></>,
        formatter: defaultFormatter
      },
      {
        field: 'torqueDemand',
        title: <>Dem. Torque <span className={styles.units}>[A]</span></>,
        formatter: defaultFormatter
      },
      {
        field: 'motorEncoder',
        title: 'Encoder',
        formatter: defaultFormatter
      },
      {
        field: 'motorEncoderRaw',
        title: 'Encoder Raw',
        formatter: defaultFormatter
      },
      {
        field: 'brakeStatus',
        title: 'Brake status',
        className: styles.statusColumn,
        formatter: (value) => {
          const brakeStatus = value === 'Unknown' || value === '-' ? value : motorBrakeStateMap[value];

          return (
            <StatusText small status={stateToStyleMotorBrake[brakeStatus]}>
              {brakeStatus}
            </StatusText>
          )
        }
      },
      {
        field: 'driveStatus',
        title: 'Drive status',
        formatter: (value) => {
          const driveStatus = value === 'Unknown' || value === '-' ? value : motorDriveStateMap[value];
          return (
            <StatusText small status={stateToStyleMotorDrive[driveStatus]}>
              {driveStatus}
            </StatusText>
          );
        },
        className: styles.statusColumn
      }
    ];



    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleTable headers={headers} data={simpleTableData} />
      </div>


    );
  }
}
