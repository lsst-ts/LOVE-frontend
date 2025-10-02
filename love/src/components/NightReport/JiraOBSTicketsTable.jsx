import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getObsDayFromDate, isNightReportOld, getCutDateFromNightReport } from 'Utils';
import { JIRA_TICKETS_BASE_URL, TIME_FORMAT } from 'Config';
import Button from 'components/GeneralPurpose/Button/Button';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import TimeLossField from './TimeLossField';
import styles from './CreateNightReport.module.css';

const OBS_TICKETS_POLLING_INTERVAL_MS = 30000; // 30 seconds

function JiraOBSTicketsTable({ report }) {
  const [tickets, setObsTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const obsTicketsPollingRef = useRef(null);

  const isReportOld = isNightReportOld(report);

  const isEditDisabled = () => {
    if (isReportOld) {
      return true;
    }
    return false;
  };

  const queryTickets = (date) => {
    setLoading(true);
    setObsTickets([]);
    const obsDay = getObsDayFromDate(date);
    ManagerInterface.getJiraOBSTickets(obsDay)
      .then((tickets) => {
        if (tickets) {
          setObsTickets(tickets);
          setLastUpdated(Moment());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isReportOld) {
      queryTickets(Moment());
      obsTicketsPollingRef.current = setInterval(() => {
        queryTickets(Moment());
      }, OBS_TICKETS_POLLING_INTERVAL_MS);
      return () => {
        if (obsTicketsPollingRef.current) {
          clearInterval(obsTicketsPollingRef.current);
          obsTicketsPollingRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (report && isReportOld) {
      const cutDate = getCutDateFromNightReport(report);
      queryTickets(cutDate);
      if (obsTicketsPollingRef.current) {
        clearInterval(obsTicketsPollingRef.current);
        obsTicketsPollingRef.current = null;
      }
    }
  }, [report?.date_sent, report?.id]);

  const calculatedTimeLoss = tickets.reduce((acc, ticket) => {
    if (ticket.time_lost) {
      return acc + ticket.time_lost;
    }
    return acc;
  }, 0);

  const tableHeaders = [
    {
      field: 'key',
      title: 'Ticket ID',
      render: (value) => (
        <a href={`${JIRA_TICKETS_BASE_URL}/${value}`} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'systems',
      title: 'Systems',
    },
    {
      field: 'summary',
      title: 'Summary',
      render: (value) => <span title={value}>{value}</span>,
    },
    {
      field: 'time_lost',
      title: 'Time Loss [hour]',
    },
  ];

  return (
    <div className={styles.obsTicketsContainer}>
      <div className={styles.reportObsTicketsTitle}>
        <div>
          <div>Faults</div>
          {!isReportOld && <div>(last updated: {lastUpdated?.format(TIME_FORMAT)} local)</div>}
          <Button
            title="Refresh tickets"
            onClick={() => {
              queryTickets(Moment());
            }}
            disabled={isEditDisabled() || loading}
          >
            <RefreshIcon title="Refresh tickets and fault time loss" className={styles.refreshIcon} />
          </Button>
        </div>
        <TimeLossField timeLoss={calculatedTimeLoss} label="Fault time loss" />
      </div>
      {loading ? (
        <SpinnerIcon className={styles.spinner} />
      ) : (
        <div className={styles.obsTicketsTableWrapper}>
          {tickets && tickets.length > 0 ? (
            <SimpleTable headers={tableHeaders} data={tickets} />
          ) : (
            <div>No tickets found.</div>
          )}
        </div>
      )}
    </div>
  );
}

JiraOBSTicketsTable.propTypes = {
  /** Report object containing the date_sent */
  report: PropTypes.object,
};

export default JiraOBSTicketsTable;
