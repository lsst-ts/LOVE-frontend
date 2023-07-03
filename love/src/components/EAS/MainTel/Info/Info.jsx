import PropTypes from 'prop-types';
import { defaultNumberFormatter } from 'Utils';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import styles from './Info.module.css';


export default function Info(props) {

  const {selectedSensorData} = props;

  return (
    <SummaryPanel className={styles.easInfo}>
      <>
        <Title>Sensor {selectedSensorData?.id ?? ''}</Title>
        <div></div>
      </>
    </SummaryPanel>
  );
};