/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { useState, useCallback, useEffect, useRef } from 'react';
import Moment from 'moment';
import ManagerInterface, { getObsDayISO } from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import styles from './HistoricNightReport.module.css';

const REPORT_STATUSES = {
  sent: 'Sent',
  draft: 'Draft',
};

function Report(data, index) {
  const isReportAlreadySent = data.date_sent ? true : false;
  return (
    <div key={index} className={styles.report}>
      <div className={styles.reportMetadata}>
        <div className={styles.label}>Observation day</div>
        <div className={styles.value}>{data.day_obs}</div>
        <div className={styles.label}>Status</div>
        <div
          className={styles.value}
          title={
            isReportAlreadySent
              ? `Report sent on ${data.date_sent}`
              : `Report not sent yet. Last update: ${data.date_added}`
          }
        >
          {isReportAlreadySent ? REPORT_STATUSES.sent : REPORT_STATUSES.draft}
        </div>
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
      <div className={styles.reportSummary}>
        <div className={styles.label}>Summary</div>
        <div className={styles.value}>{data.summary}</div>
      </div>
      <div className={styles.reportSummaryWeather}>
        <div className={styles.label}>Weather Summary</div>
        <div className={styles.value}>{data.weather}</div>
      </div>
      <div className={styles.reportSummaryMaintel}>
        <div className={styles.label}>Simonyi Summary</div>
        <div className={styles.value}>{data.maintel_summary}</div>
      </div>
      <div className={styles.reportSummaryAuxtel}>
        <div className={styles.label}>Auxtel Summary</div>
        <div className={styles.value}>{data.auxtel_summary}</div>
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
  return reports.map((report) => {
    const dayObsIso = getObsDayISO(report.day_obs);
    return {
      ...report,
      rolex_url: `${window.location.origin}/rolex?log_date=${dayObsIso}`,
      obs_fault_url: 'https://rubinobs.atlassian.net/jira/software/c/projects/OBS/boards/232',
    };
  });
}

function HistoricNightReport() {
  const [dateStart, setDateStart] = useState(Moment().subtract(1, 'days'));
  const [dateEnd, setDateEnd] = useState(Moment());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const firstQuerySent = useRef(false);

  const queryNightReport = useCallback(() => {
    setLoading(true);
    const dayObsStart = dateStart.format('YYYYMMDD');
    const dayObsEnd = Moment(dateEnd).add(1, 'd').format('YYYYMMDD');
    ManagerInterface.getHistoricNightReports(dayObsStart, dayObsEnd).then((data) => {
      if (data) {
        setReports(formatReports(data));
        setLastUpdated(new Date());
      }
      setLoading(false);
    });
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (firstQuerySent.current) {
      return;
    }
    firstQuerySent.current = true;
    queryNightReport();
  }, [queryNightReport]);

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
