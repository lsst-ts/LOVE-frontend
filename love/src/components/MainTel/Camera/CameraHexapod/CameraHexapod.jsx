import React, { Component } from 'react';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
class CameraHexapod extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  HEADERS_HEXAPOD = [
    {
      field: 'hexapodPosition',
      title: 'Hexapod Position',
    },
    {
      field: 'x',
      title: 'x',
    },
    {
      field: 'y',
      title: 'y',
    },
    {
      field: 'z',
      title: 'z',
    },
    {
      field: 'u',
      title: 'u',
    },
    {
      field: 'v',
      title: 'v',
    },
    {
      field: 'w',
      title: 'w',
    },
  ];

  HEADERS_STRUT = [
    {
      field: 'strutLength',
      title: 'Strut Length',
    },
    {
      field: '1',
      title: '1',
    },
    {
      field: '2',
      title: '2',
    },
    {
      field: '3',
      title: '3',
    },
    {
      field: '4',
      title: '4',
    },
    {
      field: '5',
      title: '5',
    },
    {
      field: '6',
      title: '6',
    },
  ];

  render() {
    const dataHexapod = [
      { hexapodPosition: 'Commanded [um, deg]', x: -19, y: -45, z: 9, u: -0.001, v: -0.001, w: -0.001 },
      { hexapodPosition: 'Actual [um, deg]', x: -19, y: -40, z: 9, u: -0.003, v: -0.001, w: -0.001 },
    ];

    const dataStrut = [{ strutLength: 'Actual [um]', 1: 33, 2: 12, 3: 8, 4: 2, 5: 33, 6: 14 }];

    return (
      <div>
        <div className={styles.hexapodContainer}>
          <SummaryPanel>
            <Title>Hexapod Status</Title>

            <Label>Hexapod Status</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>Compensation</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>ControllerSubstate</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>Interlock state</Label>
            <Value>
              <span>value</span>
            </Value>
          </SummaryPanel>
          <SummaryPanel>
            <Title>Readiness Summary</Title>

            <Label>Connected</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>Commandable By DDS</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>ControllerState</Label>
            <Value>
              <span>value</span>
            </Value>

            <Label>Hexapod in Position</Label>
            <Value>
              <span>value</span>
            </Value>
          </SummaryPanel>
        </div>
        <div>
          <SimpleTable headers={this.HEADERS_HEXAPOD} data={dataHexapod} />
          <SimpleTable headers={this.HEADERS_STRUT} data={dataStrut} />
        </div>
      </div>
    );
  }
}

export default CameraHexapod;
