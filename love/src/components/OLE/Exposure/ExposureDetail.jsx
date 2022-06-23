import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Message from './Message/Message';
import MessageEdit from './Message/MessageEdit';
import ManagerInterface from 'Utils';
import styles from './Exposure.module.css';
import { EXPOSURE_FLAG_OPTIONS } from 'Config';

const moment = extendMoment(Moment);

export default class ExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
    logMessages: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    back: () => {},
    logDetail: {
      obs_id: 'LC20210224-1',
      instrument: 'LATISS',
      observation_type: 'Engtest',
      observation_reason: 'extra',
      observation_day: undefined,
    },
    logMessages: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        site_id: '',
        type: undefined,
        user: undefined,
        exposure_flag: undefined,
        jira: undefined,
        file: undefined,
        message_text: undefined,
        date_added: undefined,
        date_invalidated: undefined,
      },
    ],
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
    };
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
    const logDetail = this.props.logDetail ? this.props.logDetail : this.defaultProps.logDetail;
    const logMessages = this.props.logMessages ? this.props.logMessages : this.defaultProps.logMessages;

    const flagsOptions = ['All', ...EXPOSURE_FLAG_OPTIONS];
    const selectedFlag = this.state.selectedFlag;

    let userOptions = new Set();
    logMessages.forEach((log) => userOptions.add(log.user_id));
    userOptions = ['All', ...Array.from(userOptions)];
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
            <span>
              <Button status="link">view Jira ticket</Button>
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
