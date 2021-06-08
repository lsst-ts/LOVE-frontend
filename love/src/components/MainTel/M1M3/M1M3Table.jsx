import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import SimpleTable from 'components//GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import styles from './M1M3Table.module.css';

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
    const data = {
      commanded: {
        name: 'Commanded',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
      measured: {
        name: 'Measured',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
      hardpoints: {
        name: 'Hardpoints',
        x: 0,
        y: 0,
        z: 0,
        mx: 0,
        my: 0,
        mz: 0,
        magnitude: 0,
      },
    };
    return data;
  };

  getMirrorPositionTableData = () => {
    const data = {
      hardpoints: {
        name: 'Hardpoints',
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
      },
      IMS: {
        name: 'IMS',
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
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
