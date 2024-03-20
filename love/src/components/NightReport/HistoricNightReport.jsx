import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getObsDayFromDate } from 'Utils';
import { TIMES_SQUARE_OBS_TICKETS_REPORT_URL } from 'Config';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './HistoricNightReport.module.css';

const TELESCOPES = {
  simonyi: 'Simonyi',
  auxtel: 'AuxTel',
};

function Report(data, index) {
  const status = data.date_sent ? 'Sent' : 'Draft';
  return (
    <div key={index} className={styles.report}>
      <div className={styles.reportMetadata}>
        <div className={styles.label}>Observation day</div>
        <div className={styles.value}>{data.day_obs}</div>
        <div className={styles.label}>Status</div>
        <div className={styles.value}>{status}</div>
        <div className={styles.label}>Obs fault report</div>
        <div className={styles.value}>
          <a href={data.obs_fault_url} target="_blank" rel="noreferrer">
            {data.obs_fault_url}
          </a>
        </div>
        <div className={styles.label}>Confluence page</div>
        <div className={styles.value}>
          <a href={data.confluence_url} target="_blank" rel="noreferrer">
            {data.confluence_url}
          </a>
        </div>
        <div className={styles.label}>Rolex entries</div>
        <div className={styles.value}>
          <a href={data.rolex_url} target="_blank" rel="noreferrer">
            {data.rolex_url}
          </a>
        </div>
      </div>
      <div className={styles.reportTelescopeStatus}>
        <div className={styles.label}>Telescope Status</div>
        <div className={styles.value}>{data.telescope_status}</div>
      </div>
      <div className={styles.reportSummary}>
        <div className={styles.label}>Summary</div>
        <div className={styles.value}>{data.summary}</div>
      </div>
      <div className={styles.reportParticipants}>
        <div className={styles.label}>Participants</div>
        <div className={styles.value}>{data.observers_crew.join(', ')}</div>
      </div>
    </div>
  );
}

/**
 * Formats the reports by adding some extra properties to each report.
 * The rolex_url is constructed using the current window location
 * and the day part of the date_added property.
 * The obs_fault_url is constructed using the TIMES_SQUARE_OBS_TICKETS_REPORT_URL
 * and the day part of the date_added property.
 * @param {Array} reports - The array of reports to be formatted.
 * @returns {Array} - The formatted array of reports.
 */
function formatReports(reports) {
  return reports.map((report) => ({
    ...report,
    rolex_url: `${window.location.origin}/rolex?log_date=${report.date_added.split('T')[0]}`,
    obs_fault_url: TIMES_SQUARE_OBS_TICKETS_REPORT_URL.replace('{DAY}', report.date_added.split('T')[0]),
  }));
}

function HistoricNightReport(props) {
  const [dateStart, setDateStart] = useState(Moment());
  const [dateEnd, setDateEnd] = useState(Moment());
  const [selectedTelescope, setSelectedTelescope] = useState(TELESCOPES.auxtel);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    queryNightReport();
  }, []);

  const queryNightReport = () => {
    setLoading(true);
    const dayObsStart = dateStart.format('YYYYMMDD');
    const dayObsEnd = Moment(dateEnd).add(1, 'd').format('YYYYMMDD');
    ManagerInterface.getHistoricNightReports(dayObsStart, dayObsEnd, selectedTelescope).then((data) => {
      if (data) {
        setReports(formatReports(data));
        setLastUpdated(new Date());
      }
      setLoading(false);
    });
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setDateStart(date);
    } else {
      setDateEnd(date);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <DateTimeRange
          label="From"
          startDate={dateStart}
          endDate={dateEnd}
          startDateProps={{
            timeFormat: false,
            maxDate: Moment(),
          }}
          endDateProps={{
            timeFormat: false,
            maxDate: Moment(),
          }}
          onChange={handleDateChange}
        />
        <Select
          value={selectedTelescope}
          onChange={({ value }) => setSelectedTelescope(value)}
          options={[
            { value: TELESCOPES.simonyi, label: 'Simonyi' },
            { value: TELESCOPES.auxtel, label: 'Auxtel' },
          ]}
        />
      </div>
      <div className={styles.refresh}>
        <Button onClick={queryNightReport} disabled={loading}>
          Refresh data
        </Button>
        <span>Last updated {lastUpdated.toISOString().split('.')[0]}</span>
      </div>
      <div className={styles.content}>{reports.map((report, index) => Report(report, index))}</div>
    </div>
  );
}

HistoricNightReport.propTypes = {};

export default HistoricNightReport;
