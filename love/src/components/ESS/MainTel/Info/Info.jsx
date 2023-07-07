import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { defaultNumberFormatter } from 'Utils';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import { fixedFloat } from 'Utils';
import styles from './Info.module.css';


function Info(props) {

  const {
    sensor
  } = props;


  return (
    <>
      <SummaryPanel className={styles.essInfo}>
        <>
          <Title>Sensor { sensor.sensorId ? String(sensor.sensorId).padStart(3, '0') : ''}</Title>
          <div></div>

          <Label>Name</Label>
          <Value>
            {sensor.sensorName}
          </Value>

          <Label>Location</Label>
          <Value>
            {sensor.location}
          </Value>

          <Label>Position X</Label>
          <Value>
            {sensor.position?.x}
          </Value>

          <Label>Position Y</Label>
          <Value>
            {sensor.position?.y}
          </Value>

          <Label>Position Z</Label>
          <Value>
            {sensor.position?.z}
          </Value>
        </>
      </SummaryPanel>
    </>
  );
};

const comparator = (prevProps, nextProps) => {
  return (
      isEqual(nextProps.sensor, prevProps.sensor)
    );
};

Info.PropTypes = {
  sensor: PropTypes.shape({
    sensorId: PropTypes.number,
    sensorName: PropTypes.string,
    temperature: PropTypes.number,
    location: PropTypes.string,
  }),
};

Info.defaultProps = {
  sensor: {
    sensorId: 0,
    sensorName: '',
    temperature: 0,
    location: '',
  }
};

export default React.memo(Info, comparator);