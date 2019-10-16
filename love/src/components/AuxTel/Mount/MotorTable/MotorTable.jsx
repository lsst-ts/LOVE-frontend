import React, { Component } from 'react';
import styles from './MotorTable.module.css';
import { Table, Thead, Tbody, Td, Tr, Th } from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import {
  motorDriveStateMap,
  stateToStyleMotorDrive,
  motorBrakeStateMap,
  stateToStyleMotorBrake,
} from '../../../../Config';

export default class MotorTable extends Component {
  constructor(props) {
    super(props);
  }

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
        angle: mountEncoders.azimuthCalculatedAngle ? mountEncoders.azimuthCalculatedAngle.value : '-',
        velocity: measuredMotorVelocity.azimuthMotor1Velocity ? measuredMotorVelocity.azimuthMotor1Velocity.value : '-',
        measuredTorque: measuredTorque.azimuthMotor1Torque ? measuredTorque.azimuthMotor1Torque.value : '-',
        torqueDemand: torqueDemand.azimuthMotor1Torque ? torqueDemand.azimuthMotor1Torque.value : '-',
        motorEncoder: mountMotorEncoders.azimuth1Encoder ? mountMotorEncoders.azimuth1Encoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.azimuth1EncoderRaw ? mountMotorEncoders.azimuth1EncoderRaw.value : '-',
        brakeStatus: azimuthBrake1,
        driveStatus: azimuthDrive1Status,
      },
      az2: {
        name: 'Az2',
        angle: mountEncoders.azimuthCalculatedAngle ? mountEncoders.azimuthCalculatedAngle.value : '-',
        velocity: measuredMotorVelocity.azimuthMotor2Velocity ? measuredMotorVelocity.azimuthMotor2Velocity.value : '-',
        measuredTorque: measuredTorque.azimuthMotor2Torque ? measuredTorque.azimuthMotor2Torque.value : '-',
        torqueDemand: torqueDemand.azimuthMotor2Torque ? torqueDemand.azimuthMotor2Torque.value : '-',
        motorEncoder: mountMotorEncoders.azimuth2Encoder ? mountMotorEncoders.azimuth2Encoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.azimuth2EncoderRaw ? mountMotorEncoders.azimuth2EncoderRaw.value : '-',
        brakeStatus: azimuthBrake2,
        driveStatus: azimuthDrive2Status,
      },
      el: {
        name: 'El',
        angle: mountEncoders.elevationCalculatedAngle ? mountEncoders.elevationCalculatedAngle.value : '-',
        velocity: measuredMotorVelocity.azimuthMotor2Velocity ? measuredMotorVelocity.azimuthMotor2Velocity.value : '-',
        measuredTorque: measuredTorque.elevationMotorTorque ? measuredTorque.elevationMotorTorque.value : '-',
        torqueDemand: torqueDemand.elevationMotorTorque ? torqueDemand.elevationMotorTorque.value : '-',
        motorEncoder: mountMotorEncoders.elevationEncoder ? mountMotorEncoders.elevationEncoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.elevationEncoderRaw ? mountMotorEncoders.elevationEncoderRaw.value : '-',
        brakeStatus: elevationBrake,
        driveStatus: elevationDriveStatus,
      },
      nas1: {
        name: 'Nas1',
        angle: mountEncoders.nasmyth1CalculatedAngle ? mountEncoders.nasmyth1CalculatedAngle.value : '-',
        velocity: measuredMotorVelocity.nasmyth1MotorVelocity ? measuredMotorVelocity.nasmyth1MotorVelocity.value : '-',
        measuredTorque: measuredTorque.nasmyth1MotorTorque ? measuredTorque.nasmyth1MotorTorque.value : '-',
        torqueDemand: torqueDemand.nasmyth1MotorTorque ? torqueDemand.nasmyth1MotorTorque.value : '-',
        motorEncoder: mountMotorEncoders.nasmyth1Encoder ? mountMotorEncoders.nasmyth1Encoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.nasmyth1EncoderRaw ? mountMotorEncoders.nasmyth1EncoderRaw.value : '-',
        brakeStatus: nasmyth1Brake,
        driveStatus: nasmyth1DriveStatus,
      },
      nas2: {
        name: 'Nas2',
        angle: mountEncoders.nasmyth2CalculatedAngle ? mountEncoders.nasmyth2CalculatedAngle.value : '-',
        velocity: measuredMotorVelocity.nasmyth2MotorVelocity ? measuredMotorVelocity.nasmyth2MotorVelocity.value : '-',
        measuredTorque: measuredTorque.nasmyth2MotorTorque ? measuredTorque.nasmyth2MotorTorque.value : '-',
        torqueDemand: torqueDemand.nasmyth2MotorTorque ? torqueDemand.nasmyth2MotorTorque.value : '-',
        motorEncoder: mountMotorEncoders.nasmyth2Encoder ? mountMotorEncoders.nasmyth2Encoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.nasmyth2EncoderRaw ? mountMotorEncoders.nasmyth2EncoderRaw.value : '-',
        brakeStatus: nasmyth2Brake,
        driveStatus: nasmyth2DriveStatus,
      },
      m3: {
        name: 'M3',
        angle: '-',
        velocity: measuredMotorVelocity.m3Velocity ? measuredMotorVelocity.m3Velocity.value : '-',
        measuredTorque: measuredTorque.m3Torque ? measuredTorque.m3Torque.value : '-',
        torqueDemand: torqueDemand.m3Torque ? torqueDemand.m3Torque.value : '-',
        motorEncoder: mountMotorEncoders.m3Encoder ? mountMotorEncoders.m3Encoder.value : '-',
        motorEncoderRaw: mountMotorEncoders.m3EncoderRaw ? mountMotorEncoders.m3EncoderRaw.value : '-',
        brakeStatus: '-',
        driveStatus: m3DriveStatus,
      },
    };

    // console.log(data);
    // console.log(this.props);
    return (
      <Table>
        <Thead>
          <Tr>
            <Th>Motor</Th>
            <Th>Axis Angle</Th>
            <Th>Velocity</Th>
            <Th>Meas. Torque</Th>
            <Th>Dem. Torque</Th>
            <Th>Encoder</Th>
            <Th>Encoder Raw</Th>
            <Th className={styles.statusColumn}>Brake status</Th>
            <Th className={styles.statusColumn}>Drive status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(data).map((key) => {
            const row = data[key];
            return (
              <Tr key={key}>
                {Object.keys(row).map((col) => {
                  const value = row[col];
                  if (col === 'angle') {
                    return (
                      <Td key={col} isNumber>
                        {isNaN(value) || Number.isInteger(value) ? value : `${Math.round(value * 100) / 100}º`}
                      </Td>
                    );
                  }
                  if (col === 'driveStatus') {
                    const driveStatus = value === 'Unknown' || value === '-' ? value : motorDriveStateMap[value];
                    return (
                      <Td key={col} className={styles.statusColumn}>
                        <StatusText small status={stateToStyleMotorDrive[driveStatus]}>
                          {driveStatus}
                        </StatusText>
                      </Td>
                    );
                  }
                  if (col === 'brakeStatus') {
                    const brakeStatus = value === 'Unknown' || value === '-' ? value : motorBrakeStateMap[value];
                    return (
                      <Td key={col} className={styles.statusColumn}>
                        <StatusText small status={stateToStyleMotorBrake[brakeStatus]}>
                          {brakeStatus}
                        </StatusText>
                      </Td>
                    );
                  }
                  if (isNaN(value)) {
                    return <Td key={col}>{value}</Td>;
                  }
                  return (
                    <Td isNumber key={col}>
                      {Number.isInteger(value) ? value : Math.round(value * 100) / 100}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}
