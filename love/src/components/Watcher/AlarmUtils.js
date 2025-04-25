/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { severityEnum } from '../../Config';

/** Auxiliary function to define wether an alarm is acknowledged or not */
export const isAcknowledged = (alarm) => {
  return alarm.acknowledged?.value;
};

/**
 * Auxiliary function to define wether an alarm is muted or not.
 * That is, its severity is lower than its mutedSeverity
 */
export const isMuted = (alarm) => alarm.mutedSeverity?.value > severityEnum.ok;

/**
 * Auxiliary function to define wether an alarm has muting configuration or not.
 * That is, its mutedSeverity > OK
 * Not that if OK < mutedSeverity < severity we wopuld have muted(a) = false and hasMuteConfig(a) = true,
 */
export const hasMuteConfig = (alarm) => alarm.mutedSeverity?.value > severityEnum.ok;

/** Auxiliary function to define wether an alarms maxSeverity is Critical */
export const isMaxCritical = (alarm) => alarm.maxSeverity?.value === severityEnum.critical;

/** Auxiliary function to define wether an alarms severity is Critical */
export const isCritical = (alarm) => alarm.severity?.value === severityEnum.critical;

/** Auxiliary function to define wether an alarm is active or not */
export const isActive = (alarm) =>
  alarm.maxSeverity?.value > severityEnum.ok && alarm.severity?.value > severityEnum.ok;

/** Auxiliary function to define wether an alarm can be unacknowledged or not */
export const canUnack = (alarm) => alarm.acknowledged?.value && alarm.severity?.value !== 1;
