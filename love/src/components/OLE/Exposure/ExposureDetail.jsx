/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import lodash from 'lodash';
import { CSVLink } from 'react-csv';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import ManagerInterface from 'Utils';
import { EXPOSURE_FLAG_OPTIONS } from 'Config';
import styles from './Exposure.module.css';
import MessageDetail from './Message/MessageDetail';
import MessageEdit from './Message/MessageEdit';

const moment = extendMoment(Moment);

export default class ExposureDetail extends Component {
  static propTypes = {
    /** Log to edit object */
    logDetail: PropTypes.object,
    /** List of messages to display */
    logMessages: PropTypes.arrayOf(PropTypes.object),
    /** Function to go back */
    back: PropTypes.func,
    /** Function to handle log adding */
    handleAddLog: PropTypes.func,
  };

  static defaultProps = {
    logDetail: {
      obs_id: 'string',
      instrument: 'LATISS',
      observation_type: 'Engtest',
      observation_reason: 'extra',
      observation_day: undefined,
    },
    logMessages: [],
    back: () => {},
    handleAddLog: () => {},
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('exposure-detail-');
    this.state = {
      selectedMessage: undefined,
      selectedFlag: 'All',
      selectedUser: 'All',
      selectedDateStart: null,
      selectedDateEnd: null,
      textFilter: '',
      newMessage: undefined,
      logMessages: props.logMessages ? props.logMessages : ExposureDetail.defaultProps.logMessages,
      confirmationModalShown: false,
      confirmationModalText: '',
      actionModal: () => {},
    };
  }

  saveMessage(message, callback) {
    const payload = { ...message };

    // Clean payload
    if (payload['tags']) {
      payload['tags'] = payload['tags'].map((tag) => tag.id);
    }

    // Transform &amp; back to '&'. This is a workaround due to Quill editor encoding '&'.}
    payload['message_text'] = payload['message_text'].replace(/&amp;/g, '&');

    ManagerInterface.updateMessageExposureLogs(message.id, payload).then((response) => {
      if (response) {
        this.setState((state) => {
          const logMessages = state.logMessages.filter((msg) => message.id !== msg.id);
          return {
            logMessages: [response, ...logMessages],
            confirmationModalShown: false,
          };
        });
      }
      if (callback) callback();
    });
  }

  deleteMessage(message) {
    ManagerInterface.deleteMessageExposureLogs(message.id).then((response) => {
      if (response) {
        this.setState((state) => {
          const newLogMessages = state.logMessages.filter((msg) => message.id !== msg.id);
          return {
            logMessages: newLogMessages,
            confirmationModalShown: false,
          };
        });
      }
    });
  }

  confirmDelete(message) {
    const modalText = (
      <span>
        You are about to <b>Delete</b> this message of Exposure Logs
        <br />
        Are you sure?
      </span>
    );

    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
      actionModal: () => this.deleteMessage(message),
    });
  }

  renderModalFooter() {
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.state.actionModal()} status="default">
          Yes
        </Button>
      </div>
    );
  }

  handleDateTimeRange(date, type) {
    if (type === 'start') {
      this.setState({ selectedDateStart: date });
    } else if (type === 'end') {
      this.setState({ selectedDateEnd: date });
    }
  }

  render() {
    const { back, logDetail, handleAddLog } = this.props;
    const { logMessages } = this.state;

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

    // Filter by text
    filteredLogMessages = filteredLogMessages.filter((log) => {
      return log.message_text.includes(this.state.textFilter) || log.id.includes(this.state.textFilter);
    });

    // Obtain headers to create csv report
    let csvHeaders = null;
    let csvData = "There aren't logs created for the current search...";
    if (filteredLogMessages.length > 0) {
      const logExampleKeys = Object.keys(filteredLogMessages?.[0] ?? {});
      csvHeaders = logExampleKeys.map((key) => ({ label: key, key }));
      csvData = filteredLogMessages;
    }

    const duration = Moment(logDetail.timespan_end).diff(Moment(logDetail.timespan_begin), 'seconds', true);

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button
            status="link"
            onClick={() => {
              back();
            }}
          >
            <span className={styles.title}>{`< Return to Observations`}</span>
          </Button>
        </div>
        <div id={this.id} className={styles.detailContainer}>
          <div className={styles.header}>
            <span>
              {logDetail.obs_id} - Duration: {duration}
            </span>
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Add Message"
                onClick={() => {
                  handleAddLog();
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

              <Input
                type="text"
                value={this.state.textFilter}
                className={styles.input}
                onChange={(e) => this.setState({ textFilter: e.target.value })}
                placeholder="Enter a word or phrase to find messages with that text on their id or message fields"
              />
              <div className={styles.divExportBtn}>
                <CSVLink data={csvData} headers={csvHeaders} filename="exposureDetailLogMessages.csv">
                  <Hoverable top={true} left={true} center={true} inside={true}>
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
                    save={(message, callback) => {
                      if (message) {
                        this.saveMessage(message, () => {
                          this.setState({ selectedMessage: undefined });
                          if (callback) callback();
                        });
                      }
                    }}
                  />
                );
              } else {
                return (
                  <MessageDetail
                    message={message}
                    editMessage={(messageEdit) => {
                      this.setState({ selectedMessage: messageEdit });
                    }}
                    deleteMessage={(_message) => {
                      if (_message) {
                        this.confirmDelete(_message);
                      }
                    }}
                  />
                );
              }
            })}
          </div>
          <Modal
            displayTopBar={false}
            isOpen={!!this.state.confirmationModalShown}
            onRequestClose={() => this.setState({ confirmationModalShown: false })}
            parentSelector={() => document.querySelector(`#${this.id}`)}
            size={50}
          >
            {this.state.confirmationModalText}
            {this.renderModalFooter()}
          </Modal>
        </div>
      </>
    );
  }
}
