import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getObsDayFromDate } from 'Utils';
import { JIRA_TICKETS_BASE_URL, TIME_FORMAT } from 'Config';
import Button from 'components/GeneralPurpose/Button/Button';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import TimeLossField from './TimeLossField';

import styles from './CreateNightReport.module.css';

const OBS_TICKETS_POLLING_INTERVAL_MS = 30000; // 30 seconds

const dummyJiraTickets = [
  {
    key: 'OBS-1027',
    systems: 'Simonyi',
    summary: 'park_dome script stalls and does not engage brakes',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1026',
    systems: 'Simonyi',
    summary: "Rotator position \"unknown format code 'f' for object of type 'str'\"",
    time_lost: 0.5,
  },
  {
    key: 'OBS-1025',
    systems: 'Simonyi',
    summary: 'Mount stopped tracking causing MTRotator and MTPtg to fault',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1024',
    systems: 'Simonyi',
    summary: 'TMA - Axes Home Status not displaying properly in Simonyi Integrated Telemetry dashboard',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1023',
    systems: 'AuxTel',
    summary: 'Axes Home Status not displaying properly in AuxTel Integrated Telemetry dashboard',
    time_lost: 0.5,
  },
];

function JiraOBSTicketsTable({ report }) {
  const [tickets, setObsTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const obsTicketsPollingRef = useRef(null);

  const isEditDisabled = () => {
    return report.date_sent ? true : false;
  };

  const queryTickets = (date) => {
    setLoading(true);
    const currentObsDay = getObsDayFromDate(date);
    // ManagerInterface.getJiraOBSTickets(currentObsDay)
    //   .then((tickets) => {
    //     if (tickets) {
    //       setObsTickets(dummyJiraTickets);
    //       setLastUpdated(Moment());
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    setObsTickets(dummyJiraTickets);
    setLastUpdated(Moment());
    setLoading(false);
  };

  useEffect(() => {
    obsTicketsPollingRef.current = setInterval(() => {
      queryTickets(Moment());
    }, OBS_TICKETS_POLLING_INTERVAL_MS);
    queryTickets(Moment());

    return () => {
      clearInterval(obsTicketsPollingRef.current);
      obsTicketsPollingRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (report?.date_sent) {
      queryTickets(Moment(report.date_sent));
      clearInterval(obsTicketsPollingRef.current);
      obsTicketsPollingRef.current = null;
    }
  }, [report?.date_sent]);

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
          <div>(last updated: {lastUpdated?.format(TIME_FORMAT)} local)</div>
          <Button
            title="Refresh tickets"
            onClick={() => {
              queryTickets(Moment());
            }}
            disabled={isEditDisabled() || loading}
          >
            <RefreshIcon title="Refresh tickets" className={styles.refreshIcon} />
          </Button>
        </div>
        <TimeLossField timeLoss={calculatedTimeLoss} label="Faul time loss" />
      </div>
      <div className={styles.obsTicketsTableWrapper}>
        {tickets && tickets.length > 0 ? (
          <SimpleTable headers={tableHeaders} data={tickets} />
        ) : (
          <div>No tickets found.</div>
        )}
      </div>
    </div>
  );
}

JiraOBSTicketsTable.propTypes = {
  /** Report object containing the date_sent */
  report: PropTypes.object,
};

export default JiraOBSTicketsTable;
