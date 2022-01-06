import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import SimpleTable from 'components//GeneralPurpose/SimpleTable/SimpleTable';
import styles from './M2Table.module.css';

export default class MotorTable extends Component {
  static forceTableHeaders() {
    return [
      {
        field: 'name',
        title: 'Forces',
      },
      {
        field: 'x',
        title: (
          <>
            X <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'y',
        title: (
          <>
            Y <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'z',
        title: (
          <>
            Z <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'mx',
        title: (
          <>
            MX <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'my',
        title: (
          <>
            MY <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'mz',
        title: (
          <>
            MZ <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'magnitude',
        title: (
          <>
            Magnitude <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
    ];
  }

  static mirrorPositionTableHeaders() {
    return [
      {
        field: 'name',
        title: 'Positions',
      },
      {
        field: 'x',
        title: (
          <>
            X <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'y',
        title: (
          <>
            Y <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'z',
        title: (
          <>
            Z <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'rx',
        title: (
          <>
            RX <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'ry',
        title: (
          <>
            RY <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'rz',
        title: (
          <>
            RZ <span className={styles.units}>[N]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
    ];
  }

  getForceTableData = () => {
    const {
      appliedFx,
      appliedFy,
      appliedFz,
      appliedMx,
      appliedMy,
      appliedMz,
      appliedForceMagnitude,
      actuatorsFx,
      actuatorsFy,
      actuatorsFz,
      actuatorsMx,
      actuatorsMy,
      actuatorsMz,
      actuatorsForceMagnitude,
      hardpointsFx,
      hardpointsFy,
      hardpointsFz,
      hardpointsMx,
      hardpointsMy,
      hardpointsMz,
      hardpointsForceMagnitude,
    } = this.props;
    const data = {
      commanded: {
        name: 'Commanded',
        x: appliedFx,
        y: appliedFy,
        z: appliedFz,
        mx: appliedMx,
        my: appliedMy,
        mz: appliedMz,
        magnitude: appliedForceMagnitude,
      },
      measured: {
        name: 'Measured',
        x: actuatorsFx,
        y: actuatorsFy,
        z: actuatorsFz,
        mx: actuatorsMx,
        my: actuatorsMy,
        mz: actuatorsMz,
        magnitude: actuatorsForceMagnitude,
      },
      hardpoints: {
        name: 'Hardpoints',
        x: hardpointsFx,
        y: hardpointsFy,
        z: hardpointsFz,
        mx: hardpointsMx,
        my: hardpointsMy,
        mz: hardpointsMz,
        magnitude: hardpointsForceMagnitude,
      },
    };
    return data;
  };

  getMirrorPositionTableData = () => {
    const {
      hardpointsXPosition,
      hardpointsYPosition,
      hardpointsZPosition,
      hardpointsXRotation,
      hardpointsYRotation,
      hardpointsZRotation,
      imsXPosition,
      imsYPosition,
      imsZPosition,
      imsXRotation,
      imsYRotation,
      imsZRotation,
    } = this.props;

    const data = {
      hardpoints: {
        name: 'Hardpoints',
        x: hardpointsXPosition,
        y: hardpointsYPosition,
        z: hardpointsZPosition,
        rx: hardpointsXRotation,
        ry: hardpointsYRotation,
        rz: hardpointsZRotation,
      },
      IMS: {
        name: 'IMS',
        x: imsXPosition,
        y: imsYPosition,
        z: imsZPosition,
        rx: imsXRotation,
        ry: imsYRotation,
        rz: imsZRotation,
      },
    };
    return data;
  };

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const forceSimpleTableData = Object.values(this.getForceTableData());
    const mirrorPositionSimpleTableData = Object.values(this.getMirrorPositionTableData());

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SimpleTable headers={MotorTable.forceTableHeaders()} data={forceSimpleTableData} />
        <SimpleTable headers={MotorTable.mirrorPositionTableHeaders()} data={mirrorPositionSimpleTableData} />
      </div>
    );
  }
}
