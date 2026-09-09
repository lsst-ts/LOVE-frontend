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

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { openInNewTab, getLinkJira, getFilesURLs, getFilename, jiraMarkdownToHtml } from 'Utils';
import { exposureFlagStateToStyle } from 'Config';
import styles from './Message.module.css';

const emtpyLog = {
  id: '',
  user_id: undefined,
  exposure_flag: undefined,
  urls: undefined,
  message_text: undefined,
  date_added: undefined,
};

const MessageDetail = ({ log = emtpyLog, edit, remove }) => {
  const linkJira = getLinkJira(log.urls);
  const filesUrls = getFilesURLs(log.urls);
  const statusFlag = exposureFlagStateToStyle[log.exposure_flag] ?? 'unknown';

  return (
    <div className={styles.message}>
      <div className={styles.header}>
        <span className={styles.title}>#{log.id}</span>

        {linkJira && (
          <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
            view Jira ticket
          </Button>
        )}

        <div>
          <span className={styles.label}>Tags:</span>
          <span className={styles.value}>{log.tags ? log.tags.join(', ') : ' no tags'}</span>
        </div>

        <div>
          <Button className={styles.iconBtn} title="Delete" onClick={() => remove(log)} status="transparent">
            <DeleteIcon className={styles.icon} />
          </Button>

          <Button className={styles.iconBtn} title="Edit" onClick={() => edit(log)} status="transparent">
            <EditIcon className={styles.icon} />
          </Button>
        </div>
      </div>

      <div className={styles.description}>
        <div className={styles.author}>
          <span>On </span>
          <span>{log.date_added} </span>
          <span>{log.user_id} </span>
          <span>wrote:</span>
        </div>
        <div
          className={['ql-editor', styles.wikiMarkupText].join(' ')}
          dangerouslySetInnerHTML={{
            __html: jiraMarkdownToHtml(log.message_text),
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
              : ' no files attached'}
          </div>
        </div>
        <div>
          <span className={styles.capitalize}>{log.exposure_flag}</span>
          <FlagIcon title={log.exposure_flag} status={statusFlag} className={styles.iconFlag} />
        </div>
      </div>
    </div>
  );
};

MessageDetail.propTypes = {
  /** Message oject */
  message: PropTypes.object,
  /** Function to edit a message */
  edit: PropTypes.func,
  /** Function to remove a message */
  remove: PropTypes.func,
};

export default MessageDetail;
