import React, { useState, memo } from 'react';
import moment from 'moment';
import { ISO_STRING_DATE_FORMAT, ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import ManagerInterface, { firstLetterToUpperCase } from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Input from 'components/GeneralPurpose/Input/Input';
import Select from 'components/GeneralPurpose/Select/Select';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';

import ExternalLinkIcon from 'components/icons/ExternalLinkIcon/ExternalLinkIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';

import styles from './BumpTests.module.css';

const AVAILABLE_EFD_CLIENTS = ['usdf_efd', 'summit_efd', 'base_efd', 'tucson_efd'];
const AVAILABLE_ACTUATORS = [
  '101',
  '102',
  '103',
  '104',
  '105',
  '106',
  '107',
  '108',
  '109',
  '110',
  '111',
  '112',
  '113',
  '114',
  '115',
  '116',
  '117',
  '118',
  '119',
  '120',
  '121',
  '122',
  '123',
  '124',
  '125',
  '126',
  '127',
  '128',
  '129',
  '130',
  '131',
  '132',
  '133',
  '134',
  '135',
  '136',
  '137',
  '138',
  '139',
  '140',
  '141',
  '142',
  '143',
  '207',
  '208',
  '209',
  '210',
  '211',
  '212',
  '214',
  '215',
  '216',
  '217',
  '218',
  '219',
  '220',
  '221',
  '222',
  '223',
  '224',
  '225',
  '227',
  '228',
  '229',
  '230',
  '231',
  '232',
  '233',
  '234',
  '235',
  '236',
  '237',
  '238',
  '239',
  '240',
  '241',
  '242',
  '243',
  '301',
  '302',
  '303',
  '304',
  '305',
  '306',
  '307',
  '308',
  '309',
  '310',
  '311',
  '312',
  '313',
  '314',
  '315',
  '316',
  '317',
  '318',
  '319',
  '320',
  '321',
  '322',
  '323',
  '324',
  '325',
  '326',
  '327',
  '328',
  '329',
  '330',
  '331',
  '332',
  '333',
  '334',
  '335',
  '336',
  '337',
  '338',
  '339',
  '340',
  '341',
  '342',
  '343',
  '407',
  '408',
  '409',
  '410',
  '411',
  '412',
  '414',
  '415',
  '416',
  '417',
  '418',
  '419',
  '420',
  '421',
  '422',
  '423',
  '424',
  '425',
  '427',
  '428',
  '429',
  '430',
  '431',
  '432',
  '433',
  '434',
  '435',
  '436',
  '437',
  '438',
  '439',
  '440',
  '441',
  '442',
  '443',
];

function BumpTests(props) {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000 + 37 * 1000)); // Add 37 seconds to comply with TAI
  const [endDate, setEndDate] = useState(new Date(Date.now() + 37 * 1000)); // Add 37 seconds to comply with TAI
  const [actuatorId, setActuatorId] = useState(AVAILABLE_ACTUATORS[0]);
  const [efdClient, setEfdClient] = useState(AVAILABLE_EFD_CLIENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSecondaryData, setHasSecondaryData] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState(true);
  const [selectedSecondary, setSelectedSecondary] = useState(true);

  const getHeaders = () => {
    return [
      {
        field: 'actuator_id',
        title: 'Actuator',
        type: 'string',
      },
      {
        field: 'type',
        title: 'Axis',
        type: 'string',
      },
      {
        field: 'start',
        title: 'Date start',
        type: 'string',
        render: (value) => moment(value).format(ISO_STRING_DATE_TIME_FORMAT),
      },
      {
        field: 'end',
        title: 'Date end',
        type: 'string',
        render: (value) => moment(value).format(ISO_STRING_DATE_TIME_FORMAT),
      },
      {
        field: 'result',
        title: 'Status',
        type: 'string',
        render: (value) => (value ? <span title="Passed">✅️</span> : <span title="Not passed">❌</span>),
      },
      {
        field: 'url',
        title: 'Chronograf link',
        type: 'string',
        render: (value, row) => (
          <a
            className={styles.externalLink}
            href={value}
            target="_blank"
            title={`${firstLetterToUpperCase(row.type)} axis reports for actuator ${actuatorId} from ${moment(
              row.start,
            ).format(ISO_STRING_DATE_FORMAT)} to ${moment(row.end).format(ISO_STRING_DATE_FORMAT)} on the ${efdClient}`}
          >
            <ExternalLinkIcon />
          </a>
        ),
      },
    ];
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const queryReports = () => {
    setIsLoading(true);
    const parsedStartDate = moment(startDate).format(ISO_STRING_DATE_FORMAT);
    const parsedEndDate = moment(endDate).format(ISO_STRING_DATE_FORMAT);
    const parsedActuatorId = parseInt(actuatorId, 10);
    ManagerInterface.getReportsM1M3BumpTests(parsedActuatorId, parsedStartDate, parsedEndDate, efdClient).then(
      (response) => {
        if (response) {
          const primaryData = response.primary.map((item) => ({
            ...item,
            type: 'primary',
            actuator_id: actuatorId,
          }));
          const secondaryData = response.secondary.map((item) => ({
            ...item,
            type: 'secondary',
            actuator_id: actuatorId,
          }));
          setData([...primaryData, ...secondaryData]);
          setHasSecondaryData(secondaryData.length > 0);
        }
        setIsLoading(false);
      },
    );
  };

  const isQueryDisabled = () => {
    return !startDate || !endDate || !actuatorId || !efdClient || isLoading;
  };

  let filteredData = [...data];
  if (!selectedPrimary) {
    filteredData = filteredData.filter((item) => item.type !== 'primary');
  }
  if (!selectedSecondary) {
    filteredData = filteredData.filter((item) => item.type !== 'secondary');
  }

  const renderDateTimeInput = (props) => {
    return <input {...props} readOnly />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.filtersTitle}>Filters</div>
      <div className={styles.filters}>
        <DateTimeRange
          startDate={startDate}
          endDate={endDate}
          label="From"
          onChange={handleDateChange}
          startDateProps={{
            timeFormat: false,
            renderInput: renderDateTimeInput,
            inputProps: {
              className: styles.dateTimeInput,
            },
          }}
          endDateProps={{
            timeFormat: false,
            renderInput: renderDateTimeInput,
            inputProps: {
              className: styles.dateTimeInput,
            },
          }}
        />
        <span>Actuator id:</span>
        <Select option={actuatorId} options={AVAILABLE_ACTUATORS} onChange={({ value }) => setActuatorId(value)} />
        <span>EFD Client</span>
        <Select option={efdClient} options={AVAILABLE_EFD_CLIENTS} onChange={({ value }) => setEfdClient(value)} />
        <Button
          title="Query bump tests results from the EFD"
          type="button"
          disabled={isQueryDisabled()}
          onClick={queryReports}
        >
          {isLoading ? <SpinnerIcon className={styles.spinnerIcon} /> : 'Query'}
        </Button>
      </div>
      {data.length > 0 && (
        <div className={styles.secondaryFilters}>
          <Input type="checkbox" checked={selectedPrimary} onChange={() => setSelectedPrimary(!selectedPrimary)} />
          <span>Show Primary Axis Results</span>
          {hasSecondaryData && (
            <>
              <Input
                type="checkbox"
                checked={selectedSecondary}
                onChange={() => setSelectedSecondary(!selectedSecondary)}
              />
              <span>Show Secondary Axis Results</span>
            </>
          )}
        </div>
      )}
      <div>
        <SimpleTable headers={getHeaders()} data={filteredData} />
      </div>
    </div>
  );
}

export default memo(BumpTests);
