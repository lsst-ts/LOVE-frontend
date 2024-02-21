import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './HistoricNightReport.module.css';

const DUMMY_DATA = [
  {
    obsday: 20240101,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-01+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-01',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    obsday: 20240102,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-02+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-02',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    obsday: 20240103,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-03+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-03',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    obsday: 20240104,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-04+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-04',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    obsday: 20240105,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-05+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-05',
    participants: ['user1', 'user2', 'user3'],
  },
  {
    obsday: 20240106,
    status: 'started',
    summary: 'This is a summary',
    telescope_status: 'Telescope is working',
    confluence_url: 'https://confluence.lsstcorp.org/display/SIM/2024-01-06+Night+Report',
    rolex_url: 'https://rolex.lsstcorp.org/night/2024-01-06',
    participants: ['user1', 'user2', 'user3'],
  },
];

function Report(data, index) {
  return (
    <div key={index} className={styles.report}>
      <div className={styles.reportMetadata}>
        <div>Observation day</div>
        <div>{data.obsday}</div>
        <div>Status</div>
        <div>{data.status}</div>
        <div>Confluence page</div>
        <div>{data.confluence_url}</div>
        <div>Rolex entries</div>
        <div>{data.rolex_url}</div>
      </div>
      <div className={styles.reportTelescopeStatus}>
        <div>Telescope Status</div>
        <div>{data.telescope_status}</div>
      </div>
      <div className={styles.reportSummary}>
        <div>Summary</div>
        <div>{data.summary}</div>
      </div>
      <div className={styles.reportParticipants}>
        <div>Participants</div>
        <div>{data.participants.join(', ')}</div>
      </div>
    </div>
  );
}

function HistoricNightReport(props) {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <DateTimeRange />
        <Select
          options={[
            { value: 'simonyi', label: 'Simonyi' },
            { value: 'auxtel', label: 'Auxtel' },
          ]}
        />
        <Button>Refresh data</Button>
        <span>Last updated {lastUpdated.toISOString()}</span>
      </div>
      <div className={styles.content}>{DUMMY_DATA.map((item, index) => Report(item, index))}</div>
    </div>
  );
}

HistoricNightReport.propTypes = {};

export default HistoricNightReport;
