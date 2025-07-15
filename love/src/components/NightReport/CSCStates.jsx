import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getEFDInstanceForHost } from 'Utils';
import { ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';

import styles from './CreateNightReport.module.css';

function CSCStates({ report, cscs: cscsProp }) {
  const [cscs, setCscs] = useState(cscsProp);

  useEffect(() => {
    if (!report?.date_sent) {
      setCscs(cscsProp);
    }
  }, [cscsProp, report?.date_sent]);

  useEffect(() => {
    if (report?.date_sent) {
      const timeCutdate = Moment(report.date_sent).format(ISO_STRING_DATE_TIME_FORMAT);
      const cscsPayload = {};
      Object.keys(cscs).forEach((cscName) => {
        const [csc, index] = cscName.split(':');
        cscsPayload[csc] = {
          [index]: {
            logevent_summaryState: ['summaryState'],
          },
        };
      });
      const efdInstance = getEFDInstanceForHost();
      if (!efdInstance) return;
      ManagerInterface.getEFDMostRecentTimeseries(cscsPayload, 1, timeCutdate, efdInstance).then((efdResponse) => {
        if (efdResponse) {
          const newCscs = {};
          Object.keys(efdResponse).forEach((topic) => {
            const topicTokens = topic.split('-');
            const cscName = topicTokens[0] + ':' + topicTokens[1];
            const cscData = efdResponse[topic];
            newCscs[cscName] = cscData.summaryState?.[0]?.value ?? 0;
          });
          setCscs(newCscs);
        }
      });
    }
  }, [report?.date_sent]);

  return (
    <div className={styles.cscStatesContainer}>
      <div className={styles.cscStatesTitle}>
        <div>CSCs States</div>
      </div>
      <div className={styles.cscStates}>
        {Object.keys(cscs).map((cscNameIndex) => {
          const cscState = cscs[cscNameIndex];
          const stateObject = CSCDetail.states[cscState ?? 0];
          return (
            <div key={cscNameIndex} className={styles.cscState}>
              <div className={styles.cscName}>{cscNameIndex}</div>
              <div title={stateObject.name} className={stateObject.class}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CSCStates.propTypes = {
  /** Report object containing the date_sent */
  report: PropTypes.object,
  /** CSCs object containing the states of each CSC */
  cscs: PropTypes.object.isRequired,
};

export default CSCStates;
