import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getEFDInstanceForHost, isNightReportOld, getCutDateFromNightReport } from 'Utils';
import { ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';

import styles from './CreateNightReport.module.css';

function CSCStates({ report, cscs: cscsProp }) {
  const [cscs, setCscs] = useState(cscsProp);
  const [loading, setLoading] = useState(false);

  const isReportOld = isNightReportOld(report);

  const fetchHistoricalData = () => {
    const cutDate = getCutDateFromNightReport(report);
    const timeCutdate = Moment(cutDate).format(ISO_STRING_DATE_TIME_FORMAT);
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

    setLoading(true);
    ManagerInterface.getEFDMostRecentTimeseries(cscsPayload, 1, timeCutdate, efdInstance)
      .then((efdResponse) => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isReportOld) {
      setCscs(cscsProp);
    }
  }, [cscsProp, isReportOld]);

  useEffect(() => {
    if (report && isReportOld) {
      fetchHistoricalData();
    }
  }, [report?.date_sent, report?.id]);

  return (
    <div className={styles.cscStatesContainer}>
      <div className={styles.cscStatesTitle}>
        <div>CSCs States</div>
      </div>
      {loading ? (
        <SpinnerIcon className={styles.spinner} />
      ) : (
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
      )}
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
