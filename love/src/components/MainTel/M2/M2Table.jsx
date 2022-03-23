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
            X <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'y',
        title: (
          <>
            Y <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'z',
        title: (
          <>
            Z <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'rx',
        title: (
          <>
            RX <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'ry',
        title: (
          <>
            RY <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
      {
        field: 'rz',
        title: (
          <>
            RZ <span className={styles.units}>[mt]</span>
          </>
        ),
        type: 'number',
        render: defaultNumberFormatter,
      },
    ];
  }

  getForceTableData = () => {
    const {
      forceBalanceFx,
      forceBalanceFy,
      forceBalanceFz,
      forceBalanceMx,
      forceBalanceMy,
      forceBalanceMz,
      netForcesFx,
      netForcesFy,
      netForcesFz,
      netMomentsMx,
      netMomentsMy,
      netMomentsMz,
    } = this.props;
    const data = {
      net: {
        name: 'Net',
        x: netForcesFx,
        y: netForcesFy,
        z: netForcesFz,
        mx: netMomentsMx,
        my: netMomentsMy,
        mz: netMomentsMz,
      },
      balanced: {
        name: 'Balanced',
        x: forceBalanceFx,
        y: forceBalanceFy,
        z: forceBalanceFz,
        mx: forceBalanceMx,
        my: forceBalanceMy,
        mz: forceBalanceMz,
      },
    };
    return data;
  };

  getMirrorPositionTableData = () => {
    const {
      positionX,
      positionY,
      positionZ,
      positionXRot,
      positionYRot,
      positionZRot,
      positionIMSX,
      positionIMSY,
      positionIMSZ,
      positionIMSXRot,
      positionIMSYRot,
      positionIMSZRot,
    } = this.props;

    const data = {
      hardpoints: {
        name: 'Hardpoints',
        x: positionX,
        y: positionY,
        z: positionZ,
        rx: positionXRot,
        ry: positionYRot,
        rz: positionZRot,
      },
      IMS: {
        name: 'IMS',
        x: positionIMSX,
        y: positionIMSY,
        z: positionIMSZ,
        rx: positionIMSXRot,
        ry: positionIMSYRot,
        rz: positionIMSZRot,
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
