import React, { Component } from 'react';
import { Table, Thead, Tbody, Td, Tr, Th } from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import {
  motorDriveStateMap,
  stateToStyleMotorDrive,
  motorBrakeStateMap,
  stateToStyleMotorBrake,
} from '../../../../Config';
import styles from './MotorTable.module.css';

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
        angle: mountEncoders.azimuthCalculatedAngle ? mountEncoders.azimuthCalculatedAngle.value[0] : '-',
        velocity: measuredMotorVelocity.azimuthMotor1Velocity ? measuredMotorVelocity.azimuthMotor1Velocity.value[0] : '-',
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
        velocity: measuredMotorVelocity.azimuthMotor2Velocity ? measuredMotorVelocity.azimuthMotor2Velocity.value[0] : '-',
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
        velocity: measuredMotorVelocity.azimuthMotor2Velocity ? measuredMotorVelocity.azimuthMotor2Velocity.value[0] : '-',
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
        velocity: measuredMotorVelocity.nasmyth1MotorVelocity ? measuredMotorVelocity.nasmyth1MotorVelocity.value[0] : '-',
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
        velocity: measuredMotorVelocity.nasmyth2MotorVelocity ? measuredMotorVelocity.nasmyth2MotorVelocity.value[0] : '-',
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

    // console.log(data);
    // console.log(this.props);
    return (
      <Table>
        <Thead>
          <Tr className={styles.headerRow}>
            <Th>Motor</Th>
            <Th>Axis Angle <span className={styles.units}>[deg]</span></Th>
            <Th>Velocity <span className={styles.units}>[deg/s]</span></Th>
            <Th>Meas. Torque <span className={styles.units}>[A]</span></Th>
            <Th>Dem. Torque <span className={styles.units}>[A]</span></Th>
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
                        {isNaN(value) || Number.isInteger(value) ? value : `${Math.round(value * 10000) / 10000}º`}
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
                    return <Td isNumber key={col}>{value}</Td>;
                  }
                  return (
                    <Td isNumber key={col}>
                      {Number.isInteger(value) ? value : Math.round(value * 10000) / 10000}
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
