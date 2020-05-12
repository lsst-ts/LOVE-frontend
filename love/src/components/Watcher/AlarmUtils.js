import { severityEnum } from '../../Config';

export const isAcknowledged = (alarm) => alarm.acknowledged?.value;

export const isMuted = (alarm) => alarm.severity?.value <= alarm.mutedSeverity?.value;

export const isMaxCritical = (alarm) => alarm.maxSeverity?.value === severityEnum.critical;

export const isActive = (alarm) => alarm.severity?.value > severityEnum.ok;
