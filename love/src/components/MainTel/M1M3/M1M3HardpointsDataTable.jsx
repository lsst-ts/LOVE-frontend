/** 
This file is part of LOVE-frontend.

Developed for the LSST Telescope and Site Systems.
This product includes software developed by the LSST Project
 (https://www.lsst.org).

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from 'components//GeneralPurpose/SimpleTable/SimpleTable';
import { defaultNumberFormatter } from 'Utils';
import styles from './M1M3HardpointsDataTable.module.css';

function getTableHeaders() {
  return [
    {
      field: 'parameter',
      title: 'Parameter',
    },
    {
      field: 'hardpoint1',
      title: '1',
    },
    {
      field: 'hardpoint2',
      title: '2',
    },
    {
      field: 'hardpoint3',
      title: '3',
    },
    {
      field: 'hardpoint4',
      title: '4',
    },
    {
      field: 'hardpoint5',
      title: '5',
    },
    {
      field: 'hardpoint6',
      title: '6',
    },
  ];
}

function transposeTelemetries(parameter, telemetryArray, renderFunction, unit = '') {
  return {
    parameter: parameter,
    hardpoint1: (
      <span>
        {renderFunction(telemetryArray[0])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
    hardpoint2: (
      <span>
        {renderFunction(telemetryArray[1])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
    hardpoint3: (
      <span>
        {renderFunction(telemetryArray[2])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
    hardpoint4: (
      <span>
        {renderFunction(telemetryArray[3])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
    hardpoint5: (
      <span>
        {renderFunction(telemetryArray[4])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
    hardpoint6: (
      <span>
        {renderFunction(telemetryArray[5])}
        {unit ? ` [${unit}]` : ''}
      </span>
    ),
  };
}

function M1M3HardpointsDataTable({
  balanceForcesApplied,
  hardpointsStepsQueued,
  hardpointsStepsCommanded,
  hardpointsEncoder,
  hardpointsMeasuredForce,
  hardpointsDisplacement,
  hardpointsBreakawayLVDT,
  hardpointsDisplacementLVDT,
  hardpointsBreakawayPressure,
  hardpointsPressureSensor1,
  hardpointsPressureSensor2,
  hardpointsPressureSensor3,
  hardpointsMajorFault,
  hardpointsMinorFault,
  hardpointsFaultOverride,
  hardpointsMainCalibrationError,
  hardpointsBackupCalibrationError,
  hardpointsLimitSwitch1Operated,
  hardpointsLimitSwitch2Operated,
  hardpointsLowProximityWarning,
  hardpointsHighProximityWarning,
  hardpointsLowAirPressureFault,
  hardpointsHighAirPressureFault,
  hardpointsUniqueIdCRCError,
  hardpointsApplicationTypeMismatch,
  hardpointsApplicationMissing,
  hardpointsApplicationCRCMismatch,
  hardpointsOneWireMissing,
  hardpointsOneWire1Mismatch,
  hardpointsOneWire2Mismatch,
  hardpointsWatchdogReset,
  hardpointsBrownOut,
  hardpointsEventTrapReset,
  hardpointsMotorDriverFault,
  hardpointsSsrPowerFault,
  hardpointsAuxPowerFault,
  hardpointsSmcPowerFault,
  hardpointsIlcFault,
  hardpointsBroadcastCounterWarning,
  hardpointMeasuredForceWarningHigh,
  hardpointMeasuredForceWarningLow,
  hardpointMeasuredForceFaultHigh,
  hardpointMeasuredForceFaultLow,
  hardpointMeasuredForceFSBWarningHigh,
  hardpointMeasuredForceFSBWarningLow,
  hardpointBreakawayFaultLow,
  hardpointBreakawayFaultHigh,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  useEffect(() => {
    subscribeToStreams();
    return () => unsubscribeToStreams();
  }, []);

  const renderMeasuredForces = (value) => {
    let limitWarningHigh, limitWarningLow, limitFaultHigh, limitFaultLow;
    if (balanceForcesApplied) {
      limitWarningHigh = hardpointMeasuredForceFSBWarningHigh;
      limitWarningLow = hardpointMeasuredForceFSBWarningLow;
    }
    limitFaultHigh = hardpointMeasuredForceFaultHigh;
    limitFaultLow = hardpointMeasuredForceFaultLow;

    let className;
    if (value > limitFaultHigh || value < limitFaultLow) {
      className = styles.overFaultThreshold;
    } else if (value > limitWarningHigh || value < limitWarningLow) {
      className = styles.overWarningThreshold;
    } else {
      className = styles.notOverThreshold;
    }
    return <span className={className}>{defaultNumberFormatter(value, 2)} [N]</span>;
  };

  const renderBreakawayPressures = (value) => {
    let className;
    if (value > hardpointBreakawayFaultHigh || value < hardpointBreakawayFaultLow) {
      className = styles.overFaultThreshold;
    } else {
      className = styles.notOverThreshold;
    }
    return <span className={className}>{defaultNumberFormatter(value, 2)} [kPa]</span>;
  };

  const renderNumbers = (value) => defaultNumberFormatter(value, 2);
  const renderBooleans = (value) => (
    <span className={!value ? styles.offWarning : styles.onWarning}>{!value ? 'Off' : 'On'}</span>
  );

  const data = [
    transposeTelemetries('Steps queued', hardpointsStepsQueued, renderNumbers),
    transposeTelemetries('Steps commanded', hardpointsStepsCommanded, renderNumbers),
    transposeTelemetries('Encoder', hardpointsEncoder, renderNumbers),
    transposeTelemetries('Measured force', hardpointsMeasuredForce, renderMeasuredForces),
    transposeTelemetries('Displacement', hardpointsDisplacement, renderNumbers, 'mm'),
    transposeTelemetries('Breakaway LVDT', hardpointsBreakawayLVDT, renderNumbers),
    transposeTelemetries('Displacement LVDT', hardpointsDisplacementLVDT, renderNumbers),
    transposeTelemetries('Breakaway pressure', hardpointsBreakawayPressure, renderBreakawayPressures),
    transposeTelemetries('Pressure sensor 1', hardpointsPressureSensor1, renderNumbers),
    transposeTelemetries('Pressure sensor 2', hardpointsPressureSensor2, renderNumbers),
    transposeTelemetries('Pressure sensor 3', hardpointsPressureSensor3, renderNumbers),
    transposeTelemetries('Major fault', hardpointsMajorFault, renderBooleans),
    transposeTelemetries('Minor fault', hardpointsMinorFault, renderBooleans),
    transposeTelemetries('Fault override', hardpointsFaultOverride, renderBooleans),
    transposeTelemetries('Main calibration error', hardpointsMainCalibrationError, renderBooleans),
    transposeTelemetries('Backup calibration error', hardpointsBackupCalibrationError, renderBooleans),
    transposeTelemetries('Limit switch 1 operated', hardpointsLimitSwitch1Operated, renderBooleans),
    transposeTelemetries('Limit switch 2 operated', hardpointsLimitSwitch2Operated, renderBooleans),
    transposeTelemetries('Low proximity warning', hardpointsLowProximityWarning, renderBooleans),
    transposeTelemetries('High proximity warning', hardpointsHighProximityWarning, renderBooleans),
    transposeTelemetries('Low air pressure fault', hardpointsLowAirPressureFault, renderBooleans),
    transposeTelemetries('High air pressure fault', hardpointsHighAirPressureFault, renderBooleans),
    transposeTelemetries('Unique ID CRC error', hardpointsUniqueIdCRCError, renderBooleans),
    transposeTelemetries('Application type mismatch', hardpointsApplicationTypeMismatch, renderBooleans),
    transposeTelemetries('Application missing', hardpointsApplicationMissing, renderBooleans),
    transposeTelemetries('Application CRC mismatch', hardpointsApplicationCRCMismatch, renderBooleans),
    transposeTelemetries('One wire missing', hardpointsOneWireMissing, renderBooleans),
    transposeTelemetries('One wire 1 mismatch', hardpointsOneWire1Mismatch, renderBooleans),
    transposeTelemetries('One wire 2 mismatch', hardpointsOneWire2Mismatch, renderBooleans),
    transposeTelemetries('Watchdog reset', hardpointsWatchdogReset, renderBooleans),
    transposeTelemetries('Brown out', hardpointsBrownOut, renderBooleans),
    transposeTelemetries('Event trap reset', hardpointsEventTrapReset, renderBooleans),
    transposeTelemetries('Motor driver fault', hardpointsMotorDriverFault, renderBooleans),
    transposeTelemetries('SSR power fault', hardpointsSsrPowerFault, renderBooleans),
    transposeTelemetries('Aux power fault', hardpointsAuxPowerFault, renderBooleans),
    transposeTelemetries('SMC power fault', hardpointsSmcPowerFault, renderBooleans),
    transposeTelemetries('ILC fault', hardpointsIlcFault, renderBooleans),
    transposeTelemetries('Broadcast counter warning', hardpointsBroadcastCounterWarning, renderBooleans),
  ];

  return (
    <div className={styles.container}>
      <SimpleTable headers={getTableHeaders()} data={data} />
    </div>
  );
}

M1M3HardpointsDataTable.propTypes = {};

export default M1M3HardpointsDataTable;
