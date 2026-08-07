/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import { ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import ManagerInterface, {
  getLinkJira,
  getFilesURLs,
  getFilename,
  formatSecondsToDigital,
  parseTaiToUtc,
  openInNewTab,
  jiraMarkdownToHtml,
  firstLetterToUpperCase,
} from 'Utils';
import { getIconLevel } from '../OLE';
import styles from './NonExposure.module.css';

const emptyLog = {
  id: undefined,
  level: 0,
  date_begin: '',
  date_end: '',
  components_json: undefined,
  time_lost: 0,
  jira_issue_id: '',
  file: undefined,
  urls: [],
  tags: [],
  message_text: '',
  is_human: true,
  category: 'None',
  time_lost_type: 'fault',
};

const NonExposureDetail = ({ log = emptyLog, back, edit, remove, taiToUtc }) => {
  console.log('NonExposureDetail log:', log);
  const [confirmationModalShown, setConfirmationModalShown] = useState(false);
  const [confirmationModalContent, setConfirmationModalContent] = useState('');

  const deleteMessage = (log) => {
    ManagerInterface.deleteMessageNarrativeLogs(log.id).then((response) => {
      if (response) {
        setConfirmationModalShown(false);
        if (remove) remove(log);
        if (back) back();
      }
    });
  };

  const confirmDelete = () => {
    const content = (
      <span>
        You are about to <b>Delete</b> this log of Narrative Logs
        <br />
        Are you sure?
      </span>
    );
    setConfirmationModalShown(true);
    setConfirmationModalContent(content);
  };

  const renderModalFooter = () => (
    <div className={styles.modalFooter}>
      <Button className={styles.borderedButton} onClick={() => setConfirmationModalShown(false)} status="transparent">
        Go back
      </Button>
      <Button onClick={() => deleteMessage(log)} status="default">
        Yes
      </Button>
    </div>
  );

  const linkJira = getLinkJira(log.urls);
  const filesUrls = getFilesURLs(log.urls);
  const obsSystem = log.components_json?.name ?? 'None';
  const allSubsystems = log.components_json?.children?.length > 0 ? log.components_json.children : [];
  const obsSubsystems = allSubsystems.length > 0 ? allSubsystems.map((ss) => ss.name).join(', ') : 'None';
  const allComponents = allSubsystems.length > 0 ? allSubsystems.map((ss) => ss.children ?? []).flat() : [];
  const obsComponents = allComponents.length > 0 ? allComponents.map((c) => c.name).join(', ') : 'None';
  const iconLevel = getIconLevel(log.level);

  const dateAddedUtc = log.date_added
    ? parseTaiToUtc(log.date_added, taiToUtc).format(ISO_STRING_DATE_TIME_FORMAT)
    : '';
  const dateBeginUtc = log.date_begin
    ? parseTaiToUtc(log.date_begin, taiToUtc).format(ISO_STRING_DATE_TIME_FORMAT)
    : '';
  const dateEndUtc = log.date_end ? parseTaiToUtc(log.date_end, taiToUtc).format(ISO_STRING_DATE_TIME_FORMAT) : '';

  const timeLostType = firstLetterToUpperCase(log.time_lost_type);
  const timeLostDigital = formatSecondsToDigital(log.time_lost * 3600);

  const detailContainerId = `nonexposure-detail-${log.id}`;

  return (
    <>
      {back && (
        <div className={styles.returnToLogs}>
          <Button status="link" onClick={() => back()}>
            <span className={styles.title}>{`< Return to Logs`}</span>
          </Button>
        </div>
      )}
      <div id={detailContainerId} className={styles.detailContainer}>
        <div className={styles.header}>
          <span className={styles.bold}>
            #{log.id} <span className={styles.levelIcon}>{iconLevel}</span>
          </span>
          {linkJira && (
            <span>
              <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
                view Jira ticket
              </Button>
            </span>
          )}
          {remove && (
            <span className={styles.floatRight}>
              <Button className={styles.iconBtn} title="Delete" onClick={() => confirmDelete()} status="transparent">
                <DeleteIcon className={styles.icon} />
              </Button>
            </span>
          )}
          {edit && (
            <span className={styles.floatRight}>
              <Button className={styles.iconBtn} title="Edit" onClick={() => edit(log)} status="transparent">
                <EditIcon className={styles.icon} />
              </Button>
            </span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.detail}>
            <span className={styles.label}>Time of Incident (UTC)</span>
            <span className={styles.value}>{`${dateBeginUtc} - ${dateEndUtc}`}</span>
            <span className={styles.label}>Time loss type</span>
            <span className={styles.value}>{timeLostType}</span>
            <span className={styles.label}>Obs. Time Loss</span>
            <span className={styles.value}>{timeLostDigital}</span>
            <span className={styles.label}>System</span>
            <span className={styles.value}>{obsSystem}</span>
            <span className={styles.label}>Subsystems</span>
            <span className={styles.value}>{obsSubsystems}</span>
            <span className={styles.label}>Components</span>
            <span className={styles.value}>{obsComponents}</span>
            <span className={styles.label}>Type of observing time</span>
            <span className={styles.value}>{log.category}</span>
          </div>
          <div className={styles.description}>
            <div className={styles.floatLeft}>
              <span>On </span>
              <span className={styles.bold}>{dateAddedUtc} (UTC)</span>
              <span className={styles.bold}>{log.user_id} </span>
              <span>wrote:</span>
            </div>
            <br></br>
            <div
              className={['ql-editor', styles.wikiMarkupText].join(' ')}
              dangerouslySetInnerHTML={{
                __html: jiraMarkdownToHtml(log.message_text),
              }}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.attachedFiles}>
            <div className={styles.label}>Files Attached:</div>
            <div>
              {filesUrls.length > 0
                ? filesUrls.map((fileurl) => (
                    <div key={fileurl} className={styles.buttonWraper}>
                      <Button
                        className={styles.fileButton}
                        title={fileurl}
                        onClick={() => openInNewTab(fileurl)}
                        status="default"
                      >
                        <DownloadIcon className={styles.downloadIcon} />
                        {getFilename(fileurl)}
                      </Button>
                    </div>
                  ))
                : 'no files attached'}
            </div>
          </div>
        </div>
      </div>
      <Modal
        displayTopBar={false}
        isOpen={confirmationModalShown}
        onRequestClose={() => setConfirmationModalShown(false)}
        parentSelector={() => document.querySelector(`#${detailContainerId}`)}
        size={50}
      >
        {confirmationModalContent}
        {renderModalFooter()}
      </Modal>
    </>
  );
};

NonExposureDetail.propTypes = {
  /** Log object with narrative log data */
  log: PropTypes.object,
  /** Function to go back */
  back: PropTypes.func,
  /** Function to edit a log */
  edit: PropTypes.func,
  /** Function to remove a log */
  remove: PropTypes.func,
  /** Seconds offset between TAI and UTC. */
  taiToUtc: PropTypes.number,
};

export default NonExposureDetail;
