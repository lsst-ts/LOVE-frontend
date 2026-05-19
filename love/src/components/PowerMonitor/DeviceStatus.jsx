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
import React from 'react';
import PropTypes from 'prop-types';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import HeartbeatIcon from 'components/icons/HeartbeatIcon/HeartbeatIcon';
import { summaryStateToStyle, POWER_MONITOR_STATUS_MAPPING } from 'Config';
import styles from './PowerMonitor.module.css';


function DeviceStatus({ status, cscState, cscIndex }) {
  const showDeviceStatus = cscState === 'ENABLED';
  return (
    <div>
      {showDeviceStatus && <StatusText status={POWER_MONITOR_STATUS_MAPPING[status]}>{status}</StatusText>}
      <HeartbeatIcon
        title={`ESS:${cscIndex} in ${cscState} state`}
        status={summaryStateToStyle[cscState]}
        className={styles.heartbeatIcon}
      />
    </div>
  );
}

DeviceStatus.propTypes = {
    /** The status of the device, which will be mapped to a human-readable status text. */
    status: PropTypes.string.isRequired,
    /** The state of the CSC, which will determine whether to show the device status or not. */
    cscState: PropTypes.string.isRequired,
    /** The index of the CSC, used for the heartbeat icon tooltip. */
    cscIndex: PropTypes.number.isRequired,
};

export default DeviceStatus;
