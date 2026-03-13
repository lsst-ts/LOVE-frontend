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
import styles from './Alert.module.css';

function Alert({ type = 'info', children }) {
  return (
    <div className={[styles.alert, styles[`alert-${type}`]].join(' ')} role="alert">
      {children}
    </div>
  );
}

Alert.propTypes = {
  /** Type of alert
   * @default 'info'
   * @options 'info', 'success', 'warning', 'error'
   */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Content of the alert */
  children: PropTypes.node,
};

export default Alert;
