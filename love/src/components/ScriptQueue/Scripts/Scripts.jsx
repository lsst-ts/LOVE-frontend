// eslint-disable-next-line
export const getStatusStyle = (status) => {
  if (!status) return '';
  if (status.toLowerCase() === 'done') return 'ok';
  if (status.toLowerCase() === 'configured') return 'ok';
  if (status.toLowerCase() === 'unconfigured') return 'warning';
  if (status.toLowerCase() === 'paused') return 'warning';
  if (status.toLowerCase() === 'stopping') return 'warning';
  if (status.toLowerCase() === 'ending') return 'warning';
  if (status.toLowerCase() === 'stopped') return 'warning';
  if (status.toLowerCase() === 'terminated') return 'alert';
  if (status.toLowerCase() === 'failed') return 'alert';
  if (status.toLowerCase() === 'failing') return 'alert';
  return '';
};
