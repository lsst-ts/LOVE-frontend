import React from 'react';
import style from './CSCSummaryIcon.module.css';


function CSCSummaryIcon() {

  // Example status, replace with actual logic
  let status = "U";
  let statusName = "Unknown";
  let details = `Summary State: ${statusName}\nLast update: YYYY-MM-DD HH:MM:SS`;

  return (
    <div className={style.CSCSummaryIcon}>
      <div className={style.status_square} title={details}>
        {status}
      </div>
    </div>
  );
}

export default CSCSummaryIcon;
