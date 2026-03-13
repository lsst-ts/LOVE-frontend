/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import PropTypes from 'prop-types';
import Input from 'components/GeneralPurpose/Input/Input';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import styles from './CreateNightReport.module.css';

function TimeLossField({ timeLoss, hint, label = 'Time Loss' }) {
  return (
    <div className={styles.timeLossField}>
      <div>{label}</div>
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
  /** Optional label for the field */
  label: PropTypes.string,
};

export default TimeLossField;
