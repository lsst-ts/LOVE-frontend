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
import Button from 'components/GeneralPurpose/Button/Button';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { openInNewTab, getLinkJira, getFilesURLs, getFilename, jiraMarkdownToHtml } from 'Utils';
import { exposureFlagStateToStyle } from 'Config';
import styles from './Message.module.css';

export default class MessageDetail extends Component {
  static propTypes = {
    /** Message oject */
    message: PropTypes.object,
    /** Function to edit a message */
    editMessage: PropTypes.func,
    /** Function to remove a message */
    deleteMessage: PropTypes.func,
  };

  static defaultProps = {
    message: {
      id: '',
      user_id: undefined,
      exposure_flag: undefined,
      urls: undefined,
      message_text: undefined,
      date_added: undefined,
    },
    editMessage: () => {},
    deleteMessage: () => {},
  };

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  render() {
    const { message, editMessage, deleteMessage } = this.props;

    const linkJira = getLinkJira(message.urls);
    const filesUrls = getFilesURLs(message.urls);

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.title, styles.margin3].join(' ')}>
            #{message.id}
            {linkJira ? (
              <span className={styles.marginLeft}>
                <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
                  view Jira ticket
                </Button>
              </span>
            ) : (
              <></>
            )}
          </span>

          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button
              className={styles.iconBtn}
              title="Delete"
              onClick={() => deleteMessage(message)}
              status="transparent"
            >
              <DeleteIcon className={styles.icon} />
            </Button>
          </span>

          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Edit" onClick={() => editMessage(message)} status="transparent">
              <EditIcon className={styles.icon} />
            </Button>
          </span>
        </div>

        <div className={styles.tags}>
          <span className={styles.label}>Tags:</span>
          <span className={styles.value} style={{ flex: 1 }}>
            {message.tags ? message.tags.join(', ') : 'no tags'}
          </span>
        </div>

        <div className={styles.description}>
          <div className={[styles.margin3].join(' ')}>
            <span>On </span>
            <span className={styles.bold}>{message.date_added} </span>
            <span className={styles.bold}>{message.user_id} </span>
            <span>wrote:</span>
          </div>
          <div
            className={['ql-editor', styles.wikiMarkupText].join(' ')}
            dangerouslySetInnerHTML={{
              __html: jiraMarkdownToHtml(message.message_text),
            }}
          />
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
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <span className={[styles.margin3, styles.capitalize].join(' ')}>{message.exposure_flag}</span>
            <span className={styles.vertAlign}>
              <FlagIcon
                title={message.exposure_flag}
                status={this.statusFlag(message.exposure_flag)}
                className={styles.iconFlag}
              />
            </span>
          </span>
        </div>
      </div>
    );
  }
}
