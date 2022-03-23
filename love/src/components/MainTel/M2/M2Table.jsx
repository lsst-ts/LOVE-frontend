import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultNumberFormatter } from 'Utils';
import SimpleTable from 'components//GeneralPurpose/SimpleTable/SimpleTable';
import styles from './M2Table.module.css';

export default class MotorTable extends Component {
  static propTypes = {
    /** Total x-force commanded by the force balance system. */
    forceBalanceFx: PropTypes.number,
    /** Total y-force commanded by the force balance system. */
    forceBalanceFy: PropTypes.number,
    /** Total z-force commanded by the force balance system. */
    forceBalanceFz: PropTypes.number,
    /** Total x-moment of force commanded by the force balance system. */
    forceBalanceMx: PropTypes.number,
    /** Total y-moment of force commanded by the force balance system. */
    forceBalanceMy: PropTypes.number,
    /** Total z-moment of force commanded by the force balance system. */
    forceBalanceMz: PropTypes.number,
    /** Net force in x direction. */
    netForcesFx: PropTypes.number,
    /** Net force in y direction. */
    netForcesFy: PropTypes.number,
    /** Net force in z direction. */
    netForcesFz: PropTypes.number,
    /** Net moment of force in x direction. */
    netMomentsMx: PropTypes.number,
    /** Net moment of force in y direction. */
    netMomentsMy: PropTypes.number,
    /** Net moment of force in z direction. */
    netMomentsMz: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Position x. */
    positionX: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Position y. */
    positionY: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Position z. */
    positionZ: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Rotation about x.*/
    positionXRot: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Rotation about y.*/
    positionYRot: PropTypes.number,
    /** M2 mirror’s rigid body position. Measured from hardpoints. Rotation about z.*/
    positionZRot: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Position x. */
    positionIMSX: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Position y. */
    positionIMSY: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Position z. */
    positionIMSZ: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Rotation about x. */
    positionIMSXRot: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Rotation about y. */
    positionIMSYRot: PropTypes.number,
    /** M2 mirror’s rigid body position measured by the independent measurement system (IMS). Rotation about z. */
    positionIMSZRot: PropTypes.number,
  };
  static defaultProps = {
    forceBalanceFx: 0,
    forceBalanceFy: 0,
    forceBalanceFz: 0,
    forceBalanceMx: 0,
    forceBalanceMy: 0,
    forceBalanceMz: 0,
    netForcesFx: 0,
    netForcesFy: 0,
    netForcesFz: 0,
    netMomentsMx: 0,
    netMomentsMy: 0,
    netMomentsMz: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    positionXRot: 0,
    positionYRot: 0,
    positionZRot: 0,
    positionIMSX: 0,
    positionIMSY: 0,
    positionIMSZ: 0,
    positionIMSXRot: 0,
    positionIMSYRot: 0,
    positionIMSZRot: 0,    
  };


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
