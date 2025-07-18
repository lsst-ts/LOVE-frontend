import React, { use } from 'react';
import style from './CSCStateIcon.module.css';


/**
 * CSCStateIcon component displays the state of a CSC (Commandable SAL Component).
 * It shows the current state of the CSC and provides a tooltip with additional details.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.cscName - The name of the CSC.
 * @param {number} props.salIndex - The salindex of the CSC.
 * @param {Object} props.summaryStateData - The summary state data from the Redux state.
 * @returns {JSX.Element} The rendered CSCStateIcon component.
 */
function CSCStateIcon( { cscName, salIndex, summaryStateData } ) {

  // Debugging: Log the props to see what is being passed
  console.log(
    `CSCStateIcon props:\n  cscName = ${cscName}\n  salIndex = ${salIndex}\n  summaryStateData = ${summaryStateData}`
  );

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
