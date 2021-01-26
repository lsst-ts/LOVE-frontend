import { severityEnum } from '../../Config';

/** Auxiliary function to define wether an alarm is acknowledged or not */
export const isAcknowledged = (alarm) =>
  alarm.acknowledged?.value || (alarm.severity?.value === 1 && alarm.maxSeverity?.value === 1);

/**
 * Auxiliary function to define wether an alarm is muted or not.
 * That is, its severity is lower than its mutedSeverity
 */
export const isMuted = (alarm) => alarm.severity?.value <= alarm.mutedSeverity?.value;

/**
 * Auxiliary function to define wether an alarm has muting configuration or not.
 * That is, its mutedSeverity > OK
 * Not that if OK < mutedSeverity < severity we wopuld have muted(a) = false and hasMuteConfig(a) = true,
 */
export const hasMuteConfig = (alarm) => alarm.mutedSeverity?.value > severityEnum.ok;

/** Auxiliary function to define wether an alarms maxSeverity is Critical */
export const isMaxCritical = (alarm) => alarm.maxSeverity?.value === severityEnum.critical;

/** Auxiliary function to define wether an alarm is active or not */
export const isActive = (alarm) => alarm.severity?.value > severityEnum.ok;

/** Auxiliary function to define wether an alarm can be unacknowledged or not */
export const canUnack = (alarm) => alarm.acknowledged?.value && alarm.severity?.value !== 1;
