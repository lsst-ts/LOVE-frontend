import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import TemperatureIcon from 'components/icons/TemperatureIcon/TemperatureIcon';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import { fixedFloat } from 'Utils';

class TemperaturesSummary extends Component {
  static propTypes = {
    /** Number of channels to display */
    numChannels: PropTypes.number,
    /** Array of temperatures */
    temperature: PropTypes.arrayOf(PropTypes.number),
    /** Location of the temperature sensors, as a comma separated value */
    location: PropTypes.string,
  };

  static defaultProps = {
    numChannels: 0,
    temperature: [],
    location: '',
  };

  render() {
    const { numChannels, temperature, location } = this.props;
    const temperatures = temperature.slice(0, numChannels);
    const locations = location ? location.split(',') : [];
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <div className={styles.title}>
            <TemperatureIcon />
            <Title>Temperatures</Title>
          </div>
          <div className={styles.summaryPanelDetail}>
            {temperatures.map((t, i) => (
              <>
                <Label>{locations[i]}</Label>
                <Value>{`${fixedFloat(t, 2)} °`}</Value>
              </>
            ))}
          </div>
        </SummaryPanel>
      </div>
    );
  }
}

function propsAreEqual(prevProps, nextProps) {
  return (
    prevProps.numChannels === nextProps.numChannels &&
    isEqual(prevProps.temperature, nextProps.temperature) &&
    prevProps.location === nextProps.location
  );
}

export default memo(TemperaturesSummary, propsAreEqual);
