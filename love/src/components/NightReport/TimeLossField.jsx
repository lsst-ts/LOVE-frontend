import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/GeneralPurpose/Input/Input';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';

import styles from './CreateNightReport.module.css';

function TimeLossField({ timeLoss, hint }) {
  return (
    <div className={styles.timeLossField}>
      <div>Time Loss</div>
      <Input className={styles.timeLossFieldInput} type="text" value={`${timeLoss} h`} readOnly={true} />
      {hint && (
        <div className={styles.timeLossFieldHint}>
          <InfoIcon title={hint} />
        </div>
      )}
    </div>
  );
}

TimeLossField.propTypes = {
  /** Time loss value in hours */
  timeLoss: PropTypes.number.isRequired,
  /** Optional hint to display additional information */
  hint: PropTypes.string,
};

export default TimeLossField;
