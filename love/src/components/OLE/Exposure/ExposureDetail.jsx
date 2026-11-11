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

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
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
import ExposureAdd from './ExposureAdd';

const moment = extendMoment(Moment);

const emptyExposure = {
  obs_id: 'string',
  instrument: 'LATISS',
  observation_type: 'Engtest',
  observation_reason: 'extra',
  observation_day: undefined,
};

const flagsOptions = [
  { label: 'All exposure flags', value: 'All' },
  ...EXPOSURE_FLAG_OPTIONS.map((flag) => ({ label: flag, value: flag })),
];

const ExposureDetail = ({ exposure = emptyExposure, logMessages: propLogMessages = [], back, add }) => {
  const [selectedLog, setSelectedLog] = useState();
  const [selectedFlag, setSelectedFlag] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const [textFilter, setTextFilter] = useState('');
  const [logMessages, setLogMessages] = useState(propLogMessages);
  const [confirmationModalShown, setConfirmationModalShown] = useState(false);
  const [confirmationModalText, setConfirmationModalText] = useState('');
  const [confirmationModalAction, setConfirmationModalAction] = useState(() => {});

  const isEditMode = !!selectedLog;

  const userOptions = useMemo(() => {
    const options = new Set();
    logMessages.forEach((log) => options.add(log.user_id));
    return [{ label: 'All users', value: 'All' }, ...Array.from(options).map((user) => ({ label: user, value: user }))];
  }, [logMessages]);

  const deleteMessage = (message) => {
    ManagerInterface.deleteMessageExposureLogs(message.id).then((response) => {
      if (response) {
        setLogMessages((prevLogMessages) => {
          return prevLogMessages.filter((msg) => message.id !== msg.id);
        });
        setConfirmationModalShown(false);
      }
    });
  };

  const confirmDelete = (message) => {
    const modalText = (
      <div className={styles.modalContent}>
        You are about to <b>delete</b> a log from exposure <b>{exposure.obs_id}</b>
        <br />
        Are you sure?
      </div>
    );
    const deleteMessageThunk = () => deleteMessage(message);
    setConfirmationModalShown(true);
    setConfirmationModalText(modalText);
    setConfirmationModalAction(() => deleteMessageThunk);
  };

  const renderModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button className={styles.borderedButton} onClick={() => setConfirmationModalShown(false)} status="transparent">
          Go back
        </Button>
        <Button onClick={() => confirmationModalAction()} status="default">
          Yes
        </Button>
      </div>
    );
  };

  // Get filtered data
  const filteredLogMessages = useMemo(() => {
    let filtered = logMessages;
    // Filter by exposure flag
    if (selectedFlag !== 'All') {
      filtered = filtered.filter((log) => log.exposure_flag === selectedFlag);
    }
    // Filter by user
    if (selectedUser !== 'All') {
      filtered = filtered.filter((log) => log.user_id === selectedUser);
    }
    // Filter by text
    if (textFilter) {
      filtered = filtered.filter((log) => log.message_text.includes(textFilter) || log.id.includes(textFilter));
    }
    return filtered;
  }, [logMessages, selectedFlag, selectedUser, textFilter]);

  // Obtain headers and parsed data to create csv report
  const csvHeaders =
    filteredLogMessages.length > 0 ? Object.keys(filteredLogMessages[0]).map((key) => ({ label: key, key })) : [];
  const csvData =
    filteredLogMessages.length > 0 ? filteredLogMessages : 'There are no logs found by the current search...';

  const duration = Moment(exposure.timespan_end).diff(Moment(exposure.timespan_begin), 'seconds', true);

  const detailContainerId = `exposure-detail-${exposure.obs_id}`;

  return (
    <div className={styles.container}>
      <div className={styles.returnToLogs}>
        <Button status="link" onClick={() => back()}>
          <span className={styles.title}>{`< Return to Observations`}</span>
        </Button>
      </div>
      <div id={detailContainerId} className={styles.detailContainer}>
        <div className={styles.header}>
          <span>
            {exposure.obs_id} - Duration: {duration}
          </span>
          <span className={styles.rightSection}>[{exposure.observation_type}]</span>
          <span>
            <Button className={styles.iconBtn} title="Add Message" onClick={() => add()} status="transparent">
              <AddIcon className={styles.icon} />
            </Button>
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.title}>Messages ({logMessages ? logMessages.length : 0})</div>

          <div className={styles.filters}>
            <Select
              options={flagsOptions}
              option={selectedFlag}
              onChange={({ value }) => setSelectedFlag(value)}
              className={styles.select}
              disabled={isEditMode}
            />

            <Select
              options={userOptions}
              option={selectedUser}
              onChange={({ value }) => setSelectedUser(value)}
              className={styles.select}
              disabled={isEditMode}
            />

            <Input
              type="text"
              value={textFilter}
              className={styles.input}
              onChange={(e) => setTextFilter(e.target.value)}
              placeholder="Enter a word or phrase to find messages with that text on their id or message fields"
              disabled={isEditMode}
            />

            <div className={[styles.divExportBtn, isEditMode ? styles.hidden : ''].join(' ')}>
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

          <div className={styles.logsContainer}>
            {filteredLogMessages.map((message) => {
              if (selectedLog && selectedLog.id === message.id) {
                return (
                  <ExposureAdd
                    key={exposure?.obs_id}
                    exposure={exposure}
                    log={selectedLog}
                    view={() => setSelectedLog(null)}
                  />
                );
              } else {
                return <MessageDetail log={message} edit={setSelectedLog} remove={confirmDelete} />;
              }
            })}
          </div>
        </div>
        <Modal
          displayTopBar={false}
          isOpen={confirmationModalShown}
          onRequestClose={() => setConfirmationModalShown(false)}
          parentSelector={() => document.querySelector(`#${detailContainerId}`)}
          size={50}
        >
          {confirmationModalText}
          {renderModalFooter()}
        </Modal>
      </div>
    </div>
  );
};

ExposureDetail.propTypes = {
  /** Log to edit object */
  exposure: PropTypes.object,
  /** List of messages to display */
  logMessages: PropTypes.arrayOf(PropTypes.object),
  /** Function to go back */
  back: PropTypes.func,
  /** Function to handle log adding */
  add: PropTypes.func,
};

export default ExposureDetail;
