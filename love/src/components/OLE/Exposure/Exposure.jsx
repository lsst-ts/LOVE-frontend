import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import ManagerInterface from 'Utils';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

const dataExposures = [
  {
    obs_id: 'AT_O_20220208_000140',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'extra',
    day_obs: 20220208,
    seq_num: 140,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278403320713,
    tracking_dec: -26.0644886120432,
    sky_angle: 188.807925992927,
    timespan_begin: '2022-02-09T00:58:20.135919',
    timespan_end: '2022-02-09T00:58:40.376000',
  },
  {
    obs_id: 'AT_O_20220208_000141',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'intra',
    day_obs: 20220208,
    seq_num: 141,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278442397096,
    tracking_dec: -26.0644740430966,
    sky_angle: 188.807774418037,
    timespan_begin: '2022-02-09T00:59:25.629547',
    timespan_end: '2022-02-09T00:59:45.857000',
  },
  {
    obs_id: 'AT_O_20220208_000142',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'extra',
    day_obs: 20220208,
    seq_num: 142,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.27839886926,
    tracking_dec: -26.0644956930385,
    sky_angle: 188.80796173635,
    timespan_begin: '2022-02-09T00:59:54.046136',
    timespan_end: '2022-02-09T01:00:14.283000',
  },
  {
    obs_id: 'AT_O_20220208_000143',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'intra',
    day_obs: 20220208,
    seq_num: 143,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278392749663,
    tracking_dec: -26.0644757888448,
    sky_angle: 188.807815914692,
    timespan_begin: '2022-02-09T01:00:57.769401',
    timespan_end: '2022-02-09T01:01:17.994000',
  },
  {
    obs_id: 'AT_O_20220208_000144',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'extra',
    day_obs: 20220208,
    seq_num: 144,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278389105931,
    tracking_dec: -26.0645115042018,
    sky_angle: 188.807943149402,
    timespan_begin: '2022-02-09T01:01:25.365043',
    timespan_end: '2022-02-09T01:01:45.600000',
  },
  {
    obs_id: 'AT_O_20220208_000145',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'intra',
    day_obs: 20220208,
    seq_num: 145,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278418936765,
    tracking_dec: -26.0644835106208,
    sky_angle: 188.807722490779,
    timespan_begin: '2022-02-09T01:02:29.059020',
    timespan_end: '2022-02-09T01:02:49.292000',
  },
  {
    obs_id: 'AT_O_20220208_000146',
    instrument: 'LATISS',
    observation_type: 'engtest',
    observation_reason: 'extra',
    day_obs: 20220208,
    seq_num: 146,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278455280663,
    tracking_dec: -26.0645015139504,
    sky_angle: 188.80799621224,
    timespan_begin: '2022-02-09T01:02:56.522201',
    timespan_end: '2022-02-09T01:03:16.754000',
  },
  {
    obs_id: 'AT_O_20220208_000147',
    instrument: 'LATISS',
    observation_type: 'science',
    observation_reason: 'final',
    day_obs: 20220208,
    seq_num: 147,
    group_name: '2022-02-09T00:55:40.390',
    target_name: 'HD  49790',
    science_program: 'CWFS',
    tracking_ra: 102.278419655072,
    tracking_dec: -26.0644911086465,
    sky_angle: 188.807788496204,
    timespan_begin: '2022-02-09T01:04:02.102938',
    timespan_end: '2022-02-09T01:04:07.331000',
  },
  {
    obs_id: 'AT_O_20220208_000148',
    instrument: 'LATISS',
    observation_type: 'science',
    observation_reason: 'object',
    day_obs: 20220208,
    seq_num: 148,
    group_name: '2022-02-09T01:15:40.129',
    target_name: 'HD  49790',
    science_program: 'unknown',
    tracking_ra: 102.278466428031,
    tracking_dec: -26.0645025436949,
    sky_angle: 338.983127195963,
    timespan_begin: '2022-02-09T01:16:34.998084',
    timespan_end: '2022-02-09T01:16:37.229000',
  },
];

export default class Exposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeAdd: false,
      selected: {},
      exposurelogs: [],
      instruments: [],
      exposureTypes: [],
    };
  }

  view(index) {
    if (index) {
      this.setState({
        modeView: true,
        selected: index,
      });
    }
  }

  add(index) {
    if (index) {
      this.setState({
        modeAdd: true,
        selected: index,
      });
    }
  }

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert',
    };
    return result[flag] ? result[flag] : 'unknown';
  }

  getHeaders = () => {
    return [
      {
        field: 'obsStatus',
        title: 'Obs. Status',
        type: 'string',
      },
      {
        field: 'obsId',
        title: 'Observation Id',
        type: 'string',
      },
      {
        field: 'timestamp',
        title: 'Date & Time (TAI)',
        type: 'timestamp',
      },
      {
        field: 'instrument',
        title: 'Instrument',
        type: 'string',
      },
      {
        field: 'flags',
        title: 'Flags',
        type: 'string',
        render: (value, row) => {
          const values = String(value).split(',');
          return values.map((val) => {
            return (
              <span>
                <FlagIcon title={val} status={this.statusFlag(val)} className={styles.iconFlag} />
              </span>
            );
          });
        },
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        render: (_, index) => {
          return (
            <>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="View"
                  onClick={() => {
                    this.view(index);
                  }}
                  status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} nonAcknowledge={false} />
                </Button>
              </span>
              <span className={styles.margin}>
                <Button
                  className={styles.iconBtn}
                  title="Add"
                  onClick={() => {
                    this.add(index);
                  }}
                  status="transparent"
                >
                  <AddIcon className={styles.icon} />
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  };

  componentDidMount() {
    console.log('componentDidMount');
    // ManagerInterface.getListExposureInstruments().then(data => console.log(data));
    this.setState({ instruments: ['LATISS', 'COMCAM'], selectedInstrument: 'LATISS' });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedInstrument !== this.state.selectedInstrument) {
      console.log('QUERY EXPOSURES...');
      // ManagerInterface.getListExposureLogs(this.state.selectedInstrument).then(({ exposurelogs }) => this.setState({ exposurelogs: exposurelogs }));
      const exposureTypes = Array.from(new Set(dataExposures.map((exp) => exp.observation_type)));
      this.setState({ exposureTypes });
      console.log(exposureTypes);
    }
  }

  render() {
    const modeView = this.state.modeView;
    const modeAdd = this.state.modeAdd;
    const headers = Object.values(this.getHeaders());

    const list = this.state.exposurelogs;

    const filteredData = [
      {
        id: 1,
        obsStatus: 'Upcomming',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'none,junk',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: 'Mia Elbo',
            flag: 'none',
            file: { name: 'file.csv', size: 6078 },
            jira: 'http://lsst.jira.org',
            description:
              'First we have the Logs component, which will display logs created by different  love-operators. This component will have two tabs, one for non-exposure logs and another for exposure logs, viewing these two types of logs is very different.',
            dateAdded: '2022-05-11 12:34',
            dateInvalidated: undefined,
          },
          {
            id: '3fa85f64-5717-4562-b3fc',
            siteId: '',
            type: undefined,
            user: 'Mia Elbo',
            flag: 'junk',
            file: { name: 'file.csv', size: 6078 },
            jira: 'http://lsst.jira.org',
            description: undefined,
            dateAdded: '2022-05-11 12:34',
            dateInvalidated: undefined,
          },
        ],
      },
      {
        id: 2,
        obsStatus: 'Ongoing',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'none,questionable',
        obsId: 'LC20210224-1',
        instrument: 'LATISS',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'none',
            jira: undefined,
            file: undefined,
            description:
              'First we have the Logs component, which will display logs created by different  love-operators.',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
          {
            id: '4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'questionable',
            file: { name: 'file.csv', size: 6078 },
            jira: 'http://lsst.jira.org',
            description:
              'This component will have two tabs, one for non-exposure logs and another for exposure logs, viewing these two types of logs is very different',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
        ],
      },
      {
        id: 3,
        obsStatus: 'Past',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'questionable',
        obsId: 'LC20210224-1',
        instrument: 'LATISS',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'questionable',
            file: { name: 'file.csv', size: 6078 },
            jira: 'http://lsst.jira.org',
            description:
              'on Image 2 we are looking at the non-exposure logs tab in which users will be able to navigate through the logs listed by their unique id on a table.',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
        ],
      },
    ];
    const tableData = Object.values(filteredData);

    const instrumentsOptions = this.state.instruments;
    const selectedInstrument = this.state.selectedInstrument;
    const exposureTypeOptions = ['All', ...this.state.exposureTypes];
    const selectedExposureType = this.state.selectedExposureType;

    return modeView && !modeAdd ? (
      <ExposureDetail
        back={() => {
          this.setState({ modeView: false });
        }}
        logDetail={this.state.selected}
      />
    ) : modeAdd && !modeView ? (
      <ExposureAdd
        back={() => {
          this.setState({ modeAdd: false });
        }}
        logEdit={this.state.selected}
      />
    ) : (
      <div className={styles.margin10}>
        <div className={styles.title}>Filter</div>
        <div className={styles.filters}>
          <Select
            options={instrumentsOptions}
            option={selectedInstrument}
            onChange={({ value }) => this.setState({ selectedInstrument: value })}
            className={styles.select}
          />

          <DateTimeRange
            onChange={(params) => console.log(params)}
            label="Date & Time"
            startDate={new Date() - 24 * 60 * 60 * 1000}
            endDate={new Date(Date.now())}
          />

          <Select
            options={exposureTypeOptions}
            option={selectedExposureType}
            onChange={({ value }) => this.setState({ selectedExposureType: value })}
            className={styles.select}
          />
        </div>
        <SimpleTable headers={headers} data={tableData} />
      </div>
    );
  }
}
