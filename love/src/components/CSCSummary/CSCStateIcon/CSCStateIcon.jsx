import React from 'react';
import style from './CSCStateIcon.module.css';


function CSCStateIcon() {

  // Example status, replace with actual logic
  let status = "U";
  let statusName = "Unknown";
  let details = `State: ${statusName}\nLast update: YYYY-MM-DD HH:MM:SS`;

  return (
    <div className={style.CSCStateIcon}>
      <div className={style.status_square} title={details}>
        {status}
      </div>
    </div>
  );
}

export default CSCStateIcon;
