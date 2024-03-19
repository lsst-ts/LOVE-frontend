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
import lodash from 'lodash';
import moment from 'moment';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import { iconLevelOLE, ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import ManagerInterface, {
  getLinkJira,
  getFilesURLs,
  getFilename,
  formatSecondsToDigital,
  openInNewTab,
  jiraMarkdownToHtml,
  firstLetterToUpperCase,
} from 'Utils';
import styles from './NonExposure.module.css';

export default class NonExposureDetail extends Component {
  static propTypes = {
    /** Log to edit object */
    logDetail: PropTypes.object,
    /** Function to go back */
    back: PropTypes.func,
    /** Function to edit a log */
    edit: PropTypes.func,
    /** Function to remove a log */
    remove: PropTypes.func,
  };

  static defaultProps = {
    logDetail: {
      id: undefined,
      level: undefined,
      date_begin: undefined,
      date_end: undefined,
      components: [],
      primary_software_components: [],
      primary_hardware_components: [],
      user: undefined,
      time_lost: undefined,
      jira: undefined,
      file: undefined,
      message_text: undefined,
      tags: [],
      urls: [],
    },
    back: () => {},
    edit: () => {},
    remove: () => {},
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('nonexposure-detail-');
    this.state = {
      confirmationModalShown: false,
      confirmationModalText: '',
    };
  }

  getIconLevel(level) {
    const icon = iconLevelOLE[level >= 100 ? 'urgent' : 'info'];
    return icon;
  }

  deleteMessage(message) {
    ManagerInterface.deleteMessageNarrativeLogs(message.id).then((response) => {
      this.setState({ confirmationModalShown: false });
      if (response) {
        this.props.remove(message);
      }
    });
  }

  confirmDelete() {
    const modalText = (
      <span>
        You are about to <b>Delete</b> this message of Narrative Logs
        <br />
        Are you sure?
      </span>
    );

    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
    });
  }

  renderModalFooter() {
    const logDetail = this.props.logDetail ?? NonExposureDetail.defaultProps.logDetail;
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.deleteMessage(logDetail)} status="default">
          Yes
        </Button>
      </div>
    );
  }

  render() {
    const { back } = this.props;
    const { confirmationModalShown, confirmationModalText } = this.state;

    const logDetail = this.props.logDetail ?? NonExposureDetail.defaultProps.logDetail;
    const edit = this.props.edit ?? NonExposureDetail.defaultProps.edit;

    const linkJira = getLinkJira(logDetail.urls);
    const filesUrls = getFilesURLs(logDetail.urls);

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button
            status="link"
            onClick={() => {
              back();
            }}
          >
            <span className={styles.title}>{`< Return to Logs`}</span>
          </Button>
        </div>
        <div id={this.id} className={styles.detailContainer}>
          <div className={styles.header}>
            <span className={styles.bold}>
              #{logDetail.id} <span className={styles.levelIcon}>{this.getIconLevel(logDetail.level)}</span>
            </span>
            {linkJira ? (
              <span>
                <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
                  view Jira ticket
                </Button>
              </span>
            ) : (
              <></>
            )}
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Delete"
                onClick={() => this.confirmDelete()}
                status="transparent"
              >
                <DeleteIcon className={styles.icon} />
              </Button>
            </span>
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Edit"
                onClick={() => {
                  edit(true);
                }}
                status="transparent"
              >
                <EditIcon className={styles.icon} />
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.detail}>
              <span className={styles.label}>Time of Incident (UTC)</span>
              <span className={styles.value}>{`${logDetail.date_begin.split('.')[0]} - ${
                logDetail.date_end.split('.')[0]
              }`}</span>
              <span className={styles.label}>Time loss type</span>
              <span className={styles.value}>{firstLetterToUpperCase(logDetail.time_lost_type)}</span>
              <span className={styles.label}>Obs. Time Loss</span>
              <span className={styles.value}>{formatSecondsToDigital(logDetail.time_lost * 3600)}</span>
              <span className={styles.label}>Components</span>
              <span className={styles.value}>
                {logDetail.components?.length > 0 ? logDetail.components.join(', ') : 'None'}
              </span>
              <span className={styles.label}>Primary Software Component</span>
              <span className={styles.value}>{logDetail.primary_software_components?.join(', ')}</span>
              <span className={styles.label}>Primary Hardware Component</span>
              <span className={styles.value}>{logDetail.primary_hardware_components?.join(', ')}</span>
              <span className={styles.label}>Type of observing time</span>
              <span className={styles.value}>{logDetail.category}</span>
            </div>
            <div className={styles.description}>
              <div className={styles.floatLeft}>
                <span>On </span>
                <span className={styles.bold}>
                  {moment(logDetail.date_added).format(ISO_STRING_DATE_TIME_FORMAT) + ' (UTC) '}
                </span>
                <span className={styles.bold}>{logDetail.user_id} </span>
                <span>wrote:</span>
              </div>
              <br></br>
              <div
                className={['ql-editor', styles.wikiMarkupText].join(' ')}
                dangerouslySetInnerHTML={{
                  __html: jiraMarkdownToHtml(logDetail.message_text),
                }}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.attachedFiles}>
              <div className={styles.label}>Files Attached:</div>
              <div>
                {filesUrls.length > 0
                  ? filesUrls.map((fileurl, index) => (
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
          isOpen={!!confirmationModalShown}
          onRequestClose={() => this.setState({ confirmationModalShown: false })}
          parentSelector={() => document.querySelector(`#${this.id}`)}
          size={50}
        >
          {confirmationModalText}
          {this.renderModalFooter()}
        </Modal>
      </>
    );
  }
}
