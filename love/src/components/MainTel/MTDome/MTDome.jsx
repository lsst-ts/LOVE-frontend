import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MTDomeShutter from './MTDomeShutter';
import MTDomeLouvers from './MTDomeLouvers';
import MTDomePointing from './MTDomePointing';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Azimuth from 'components/GeneralPurpose/Azimuth/Azimuth';
import Elevation from 'components/GeneralPurpose/Elevation/Elevation';
import WindRose from '../../icons/WindRose/WindRose';
import MTDomeSummaryTable from './MTDomeSummaryTable/MTDomeSummaryTable';
import styles from './MTDome.module.css';

import { MTDomeLouversMapAF, MTDomeLouversMapGN } from 'Config';

const defaultValuesAF = {
  A1: '0',
  A2: '0',
  B1: '0',
  B2: '0',
  B3: '0',
  C1: '0',
  C2: '0',
  C3: '0',
  D1: '0',
  D2: '0',
  D3: '0',
  E1: '0',
  E2: '0',
  E3: '0',
  F1: '0',
  F2: '0',
  F3: '0',
};

const defaultValuesGN = {
  G1: '0',
  G2: '0',
  G3: '0',
  H1: '0',
  H2: '0',
  H3: '0',
  I1: '0',
  I2: '0',
  I3: '0',
  L1: '0',
  L2: '0',
  L3: '0',
  M1: '0',
  M2: '0',
  M3: '0',
  N1: '0',
  N2: '0',
};

const azimuthPlotInputs = {
  'Dome Azimuth': {
    type: 'line',
    color: 'hsl(201, 70%, 40%)',
    dash: [4, 0],
    orient: 'left',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTDome',
        salindex: '0',
        topic: 'azimuth',
        item: 'positionActual',
        accessor: '(x) => x',
      }
    ]
  },
  'Dome Target Az': {
    type: 'line',
    color: 'hsl(201, 70%, 40%)',
    dash: [4, 1],
    orient: 'left',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTDome',
        salindex: '0',
        topic: 'azimuth',
        item: 'positionCommanded',
        accessor: '(x) => x',
      }
    ]
  },
  'Mount Azimuth': {
    type: 'line',
    color: 'hsl(160, 70%, 40%)',
    dash: [4, 0],
    orient: 'right',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTMount',
        salindex: 0,
        topic: 'azimuth',
        item: 'actualPosition',
        accessor: '(x) => x',
      }
    ]
  },
  'Mount Target': {
    type: 'line',
    color: 'hsl(160, 70%, 40%)',
    dash: [4, 1],
    orient: 'right',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTMount',
        salindex: 0,
        topic: 'azimuth',
        item: 'demandPosition',
        accessor: '(x) => x',
      }
    ]
  },
};

const elevationPlotInputs = {
  'Mount elevation': {
    type: 'line',
    color: 'hsl(201, 70%, 40%)',
    dash: [4, 0],
    orient: 'left',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTMount',
        salindex: '0',
        topic: 'elevation',
        item: 'actualPosition',
        accessor: '(x) => x',
      }
    ]
  },
  'Mount target': {
    type: 'line',
    color: 'white',
    dash: [4, 1],
    orient: 'right',
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'MTMount',
        salindex: '0',
        topic: 'elevation',
        item: 'demandPosition',
        accessor: '(x) => x',
      }
    ]
  }
};

export default class MTDome extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Measured position of the aperture shutter (percent open) */
    positionActualShutter: PropTypes.number,
    /** Commanded position of the aperture shutter (percent open) */
    positionCommandedShutter: PropTypes.number,
    /** Measured azimuth axis position */
    positionActualDomeAz: PropTypes.number,
    /** Commanded azimuth position */
    positionCommandedDomeAz: PropTypes.number,
    /** Measured position of the light/wind screen */
    positionActualLightWindScreen: PropTypes.number,
    /** Commanded position of the light/wind screen */
    positionCommandedLightWindScreen: PropTypes.number,
    /** Measured position of each louver (percent open) */
    actualPositionLouvers: PropTypes.array,
    /** Commanded position of each louver (percent open) */
    commandedPositionLouvers: PropTypes.array,
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** High level state machine state identifier of the MTDome. */
    mtDomeSummaryState: PropTypes.number,
    /** Enabled state; an EnabledState enum */
    azimuthDomeState: PropTypes.number,
    /** The motion state; a MotionState enum */
    azimuthDomeMotion: PropTypes.number,
    /** Target position; nan for the crawlAz command */
    azimuthDomeTarget: PropTypes.number,
    /** Operational mode; an OperationalMode enum */
    modeDomeStatus: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingAz: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingAz: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingEl: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingEl: PropTypes.number,
    /** High level state machine state identifier of the MTMount. */
    mtMountSummaryState: PropTypes.number,
  };

  static defaultProps = {
    positionActualShutter: 0,
    positionCommandedShutter: 0,
    positionActualDomeAz: 0,
    positionCommandedDomeAz: 0,
    positionActualLightWindScreen: 0,
    positionCommandedLightWindScreen: 0,
    actualPositionLouvers: [],
    commandedPositionLouvers: [],
    trackId: 0,
    mtdomeSummaryState: 0,
    azimuthDomeState: 0,
    azimuthDomeMotion: 0,
    azimuthDomeTarget: 0,
    modeDomeStatus: 0,
    currentPointingAz: 0,
    targetPointingAz: 0,
    currentPointingEl: 90,
    targetPointingEl: 0,
    width: 350,
    height: 350,
    heightLouvers: 400,
    isProjected: true,
    mtDomeSummaryState: 0,
    mtMountSummaryState: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataLouversAF: [
        {
          Louvers: 'Open [%]',
          ...defaultValuesAF,
        },
        {
          Louvers: 'Cmd. [%]',
          ...defaultValuesAF,
        },
      ],
      dataLouversGN: [
        {
          Louvers: 'Open [%]',
          ...defaultValuesGN,
        },
        {
          Louvers: 'Cmd. [%]',
          ...defaultValuesGN,
        },
      ],
    };
    this.azimuthPlotRef = React.createRef();
    this.elevationPlotRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.actualPositionLouvers !== this.props.actualPositionLouvers) {
      const dataLouversAFActual = {};
      MTDomeLouversMapAF.forEach((l, i) => {
        dataLouversAFActual[l] = `${this.props.actualPositionLouvers[i].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversAF: [{ ...state.dataLouversAF[0], ...dataLouversAFActual }, { ...state.dataLouversAF[1] }],
      }));

      const dataLouversGNActual = {};
      MTDomeLouversMapGN.forEach((l, i) => {
        dataLouversGNActual[l] = `${this.props.actualPositionLouvers[i + 17].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversGN: [{ ...state.dataLouversGN[0], ...dataLouversGNActual }, { ...state.dataLouversGN[1] }],
      }));
    }

    if (prevProps.commandedPositionLouvers !== this.props.commandedPositionLouvers) {
      const dataLouversAFCommanded = {};
      MTDomeLouversMapAF.forEach((l, i) => {
        dataLouversAFCommanded[l] = `${this.props.commandedPositionLouvers[i].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversAF: [{ ...state.dataLouversAF[0] }, { ...state.dataLouversAF[1], ...dataLouversAFCommanded }],
      }));

      const dataLouversGNCommanded = {};
      MTDomeLouversMapGN.forEach((l, i) => {
        dataLouversGNCommanded[l] = `${this.props.commandedPositionLouvers[i + 17].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversGN: [{ ...state.dataLouversGN[0] }, { ...state.dataLouversGN[1], ...dataLouversGNCommanded }],
      }));
    }
  };

  LOUVERS_AF = [
    {
      field: 'Louvers',
      title: 'Louvers',
      className: styles.firstColumn,
    },
    {
      field: 'A1',
      title: 'A1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'A2',
      title: 'A2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B1',
      title: 'B1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B2',
      title: 'B2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B3',
      title: 'B3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C1',
      title: 'C1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C2',
      title: 'C2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C3',
      title: 'C3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'D1',
      title: 'D1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'D2',
      title: 'D2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E1',
      title: 'E1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E2',
      title: 'E2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E3',
      title: 'E3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F1',
      title: 'F1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F2',
      title: 'F2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F3',
      title: 'F3',
      className: styles.columns,
      type: 'number',
    },
  ];

  LOUVERS_GN = [
    {
      field: 'Louvers',
      title: 'Louvers',
      className: styles.firstColumn,
    },
    {
      field: 'G1',
      title: 'G1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'G2',
      title: 'G2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'G3',
      title: 'G3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H1',
      title: 'H1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H2',
      title: 'H2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H3',
      title: 'H3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I1',
      title: 'I1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I2',
      title: 'I2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I3',
      title: 'I3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L1',
      title: 'L1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L2',
      title: 'L2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L3',
      title: 'L3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M1',
      title: 'M1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M2',
      title: 'M2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M3',
      title: 'M3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'N1',
      title: 'N1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'N2',
      title: 'N2',
      className: styles.columns,
      type: 'number',
    },
  ];

  render() {
    const isProjected = this.props.isProjected;
    const width = this.props.width;
    const height = this.props.height;

    //SummaryPanel
    const trackID = this.props.trackId;
    const mtDomeSummaryState = this.props.mtDomeSummaryState;
    const modeDomeStatus = this.props.modeDomeStatus;
    const azimuthDomeState = this.props.azimuthDomeState;
    const azimuthDomeTarget = this.props.azimuthDomeTarget;
    const azimuthDomeMotion = this.props.azimuthDomeMotion;
    const mtMountSummaryState = this.props.mtMountSummaryState;

    //domeAzimuth
    const positionActualDomeAz = this.props.positionActualDomeAz;
    const positionCommandedDomeAz = this.props.positionCommandedDomeAz;

    //lightWindScreen
    const positionActualLightWindScreen = this.props.positionActualLightWindScreen;
    const positionCommandedLightWindScreen = this.props.positionCommandedLightWindScreen;

    //apertureShutters
    const positionActualShutter = this.props.positionActualShutter;
    const positionCommandedShutter = this.props.positionCommandedShutter;

    // Louvers
    const actualPositionLouvers = this.props?.actualPositionLouvers;
    const commandedPositionLouvers = this.props?.commandedPositionLouvers;

    // pointing
    const currentPointing = {
      az: this.props.currentPointingAz,
      el: this.props.currentPointingEl,
    };

    const targetPointing = {
      az: this.props.targetPointingAz,
      el: this.props.targetPointingEl,
    };

    return (
      <div className={styles.domeContainer}>
        <div className={styles.topRow}>
          <div className={styles.windRoseContainer}>
            <WindRose />
          </div>
          <div className={styles.elevationContainer} height={`${height / 2}px`}>
            <Elevation
              height={height * 0.75}
              radius={width * 0.75}
              maxL3={86.5}
              maxL2={85}
              maxL1={84}
              minL1={18}
              minL2={19}
              minL3={20}
              currentValue={positionActualLightWindScreen}
              targetValue={positionCommandedLightWindScreen}
              className={styles.svgElevation}
            />
          </div>

          <div className={styles.divDome}>
            <div className={styles.divDomeLouvers}>
              <Azimuth
                className={styles.svgAzimuth}
                width={width}
                height={height}
                currentValue={positionActualDomeAz}
                targetValue={positionCommandedDomeAz}
              />
              <MTDomeShutter
                width={width}
                height={height}
                positionActualShutter={positionActualShutter}
                positionCommandedShutter={positionCommandedShutter}
                positionActualDomeAz={positionActualDomeAz}
                positionCommandedDomeAz={positionCommandedDomeAz}
                positionActualLightWindScreen={positionActualLightWindScreen}
                positionCommandedLightWindScreen={positionCommandedLightWindScreen}
              />

              <MTDomePointing
                width={width}
                height={height}
                currentPointing={currentPointing}
                targetPointing={targetPointing}
                isProjected={isProjected}
              />
              <MTDomeLouvers
                actualPositionLouvers={actualPositionLouvers}
                commandedPositionLouvers={commandedPositionLouvers}
              />
            </div>
            <div className={styles.divSummaryTable}>
              <MTDomeSummaryTable
                trackID={trackID}
                mtDomeSummaryState={mtDomeSummaryState}
                mtMountSummaryState={mtMountSummaryState}
                modeDomeStatus={modeDomeStatus}
                azimuthDomeState={azimuthDomeState}
                azimuthDomeTarget={azimuthDomeTarget}
                azimuthDomeMotion={azimuthDomeMotion}
                positionActualDomeAz={positionActualDomeAz}
                positionCommandedDomeAz={positionCommandedDomeAz}
                positionActualLightWindScreen={positionActualLightWindScreen}
                positionCommandedLightWindScreen={positionCommandedLightWindScreen}
                positionActualShutter={positionActualShutter}
                positionCommandedShutter={positionCommandedShutter}
                currentPointing={currentPointing}
                targetPointing={targetPointing}
              />
            </div>
          </div>
        </div>

        <div className={styles.plotSection}>
          <div>
            <div>Azimuth</div>
            <div ref={this.azimuthPlotRef}>
              <PlotContainer
                inputs={azimuthPlotInputs}
                containerNode={this.azimuthPlotRef?.current}
                xAxisTitle="Time"
                yAxisTitle="Azimuth"
                maxHeight={250}
              />
            </div>
          </div>
          <div>
            <div>Elevation</div>
            <div ref={this.elevationPlotRef}>
              <PlotContainer
                inputs={elevationPlotInputs}
                containerNode={this.elevationPlotRef?.current}
                xAxisTitle="Time"
                yAxisTitle="Elevation"
                maxHeight={250}
              />
            </div>
          </div>
        </div>

        <SimpleTable headers={this.LOUVERS_AF} data={this.state.dataLouversAF} />
        <SimpleTable headers={this.LOUVERS_GN} data={this.state.dataLouversGN} />
      </div>
    );
  }
}
