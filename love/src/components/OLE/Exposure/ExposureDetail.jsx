import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import ManagerInterface from 'Utils';
import { EXPOSURE_FLAG_OPTIONS } from 'Config';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import Message from './Message/Message';
import MessageEdit from './Message/MessageEdit';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import styles from './Exposure.module.css';
import { CSVLink } from 'react-csv';

const moment = extendMoment(Moment);

export default class ExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
    logMessages: PropTypes.arrayOf(PropTypes.object),
    edit: PropTypes.func,
  };

  static defaultProps = {
    back: () => {},
    logDetail: {
      obs_id: 'string',
      instrument: 'LATISS',
      observation_type: 'Engtest',
      observation_reason: 'extra',
      observation_day: undefined,
    },
    logMessages: [],
    edit: () => {},
  };

  saveMessage(message) {
    console.log('save message', message);
    ManagerInterface.updateMessageExposureLogs(message.id, message).then((response) => {
      console.log('result', response);
    });
  }

  deleteMessage(message) {
    console.log('deleteMessage', message);
    ManagerInterface.deleteMessageExposureLogs(message.id).then((response) => {
      console.log('result', response);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedMessage: undefined,
      selectedFlag: 'All',
      selectedUser: 'All',
      selectedDateStart: null,
      selectedDateEnd: null,
      textFilter: '',
      newMessage: undefined,
    };
  }

  saveMessage(message) {
    ManagerInterface.updateMessageExposureLogs(message.id, message).then((response) => {
      console.log('result', response);
    });
  }

  deleteMessage(message) {
    ManagerInterface.deleteMessageExposureLogs(message.id).then((response) => {
      console.log('result', response);
    });
  }

  handleDateTimeRange(date, type) {
    if (type === 'start') {
      this.setState({ selectedDateStart: date });
    } else if (type === 'end') {
      this.setState({ selectedDateEnd: date });
    }
  }

  render() {
    const link = this.props.back;
    const logDetail = this.props.logDetail ?? this.defaultProps.logDetail;
    const logMessages = this.props.logMessages ?? this.defaultProps.logMessages;
    const edit = this.props.edit ?? ExposureDetail.defaultProps.edit;

    const flagsOptions = [
      { label: 'All exposure flags', value: 'All' },
      ...EXPOSURE_FLAG_OPTIONS.map((flag) => ({ label: flag, value: flag })),
    ];
    const selectedFlag = this.state.selectedFlag;

    let userOptions = new Set();
    logMessages.forEach((log) => userOptions.add(log.user_id));
    userOptions = [
      { label: 'All users', value: 'All' },
      ...Array.from(userOptions).map((user) => ({ label: user, value: user })),
    ];
    const selectedUser = this.state.selectedUser;

    // Filter by exposure flag
    let filteredLogMessages =
      selectedFlag !== 'All' ? logMessages.filter((log) => log.exposure_flag === selectedFlag) : logMessages;

    // Filter by user
    filteredLogMessages =
      selectedUser !== 'All' ? logMessages.filter((log) => log.user_id === selectedUser) : filteredLogMessages;

    // Filter by date range
    const range = moment.range(this.state.selectedDateStart, this.state.selectedDateEnd);
    filteredLogMessages = filteredLogMessages.filter((log) => range.contains(Moment(log.date_added)));

    // Filter by text
    filteredLogMessages = filteredLogMessages.filter((log) => {
      return log.message_text.includes(this.state.textFilter) || log.id.includes(this.state.textFilter);
    });

    const logExample = filteredLogMessages?.[0];
    const logExampleKeys = Object.keys(logExample ?? {});
    const csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button
            status="link"
            onClick={() => {
              link();
            }}
          >
            <span className={styles.title}>{`< Return to Observations`}</span>
          </Button>
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span>{logDetail.obs_id}</span>
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Add Message"
                onClick={() => {
                  edit(true);
                }}
                status="transparent"
              >
                <AddIcon className={styles.icon} />
              </Button>
            </span>
            <span className={styles.floatRight}>[{logDetail.observation_type}]</span>
          </div>
          <div className={styles.body}>
            <div className={[styles.floatLeft, styles.title].join(' ')}>
              Messages ({logMessages ? logMessages.length : 0})
            </div>

            <div className={styles.filters}>
              <Select
                options={flagsOptions}
                option={selectedFlag}
                onChange={({ value }) => this.setState({ selectedFlag: value })}
                className={styles.select}
              />

              <Select
                options={userOptions}
                option={selectedUser}
                onChange={({ value }) => this.setState({ selectedUser: value })}
                className={styles.select}
              />

              <DateTimeRange
                className={styles.dateRange}
                onChange={(date, type) => this.handleDateTimeRange(date, type)}
                label="Date & Time"
                startDate={new Date() - 24 * 30 * 5 * 60 * 60 * 1000}
                endDate={new Date(Date.now())}
              />

              <Input
                type="text"
                value={this.state.textFilter}
                className={styles.input}
                onChange={(e) => this.setState({ textFilter: e.target.value })}
                placeholder="Enter a word or phrase to find messages with that text on their id or message fields"
              />
              <div className={styles.divExportBtn}>
                <CSVLink data={filteredLogMessages} headers={csvHeaders} filename="exposureLogMessages.csv">
                  <Hoverable top={true} left={true} inside={true}>
                    <span className={styles.infoIcon}>
                      <DownloadIcon className={styles.iconCSV} />
                    </span>
                    <div className={styles.hover}>Download this report as csv file</div>
                  </Hoverable>
                </CSVLink>
              </div>
            </div>

            {filteredLogMessages.map((message) => {
              if (this.state.selectedMessage && this.state.selectedMessage.id === message.id) {
                return (
                  <MessageEdit
                    message={this.state.selectedMessage}
                    cancel={() => {
                      this.setState({ selectedMessage: undefined });
                    }}
                    save={(message) => {
                      this.saveMessage(message);
                      this.setState({ selectedMessage: undefined });
                    }}
                  />
                );
              } else {
                return (
                  <Message
                    message={message}
                    editMessage={(messageEdit) => {
                      this.setState({ selectedMessage: messageEdit });
                    }}
                    deleteMessage={(message) => {
                      this.deleteMessage(message);
                    }}
                  />
                );
              }
            })}
          </div>
        </div>
      </>
    );
  }
}