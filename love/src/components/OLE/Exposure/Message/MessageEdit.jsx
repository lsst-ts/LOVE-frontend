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
import { EXPOSURE_FLAG_OPTIONS, exposureFlagStateToStyle } from 'Config';
import RichTextEditor from 'components/GeneralPurpose/RichTextEditor/RichTextEditor';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SaveIcon from 'components/icons/SaveIcon/SaveIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import ManagerInterface, {
  openInNewTab,
  getLinkJira,
  getFilesURLs,
  getFilename,
  htmlToJiraMarkdown,
  jiraMarkdownToHtml,
} from 'Utils';
import styles from './Message.module.css';

export default class MessageEdit extends Component {
  static propTypes = {
    /** Message oject */
    message: PropTypes.object,
    /** Function to edit a message */
    cancel: PropTypes.func,
    /** Function to remove a message */
    save: PropTypes.func,
  };

  static defaultProps = {
    message: {
      id: '',
      message_text: undefined,
      file: undefined,
      jira: false,
      urls: [],
      tags: [],
    },
    cancel: () => {},
    save: () => {},
  };

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  constructor(props) {
    super(props);
    const { message } = props;

    // Clean null and empty values to avoid API errors
    Object.keys(message).forEach((key) => {
      if (message[key] === null || (Array.isArray(message[key]) && message[key].length === 0)) {
        delete message[key];
      }
    });

    this.state = {
      message,
      imageTags: [],
      updatingLog: false,
    };

    this.richTextEditorRef = React.createRef();
  }

  componentDidMount() {
    const { message } = this.state;
    ManagerInterface.getListImageTags().then((data) => {
      message.tagObjects = message.tags
        .filter((tag) => tag !== 'undefined')
        .map((tag) => {
          const tagObj = data.find((t) => t.key === tag);
          return { name: tagObj.label, id: tagObj.key };
        });
      this.setState({
        imageTags: data.map((tag) => ({ name: tag.label, id: tag.key })),
        message,
      });
    });
  }

  render() {
    const { cancel, save } = this.props;
    const { message, imageTags, updatingLog } = this.state;

    const jiraUrl = getLinkJira(message.urls);
    const filesUrls = getFilesURLs(message.urls);

    const htmlMessage = jiraMarkdownToHtml(message.message_text, { codeFriendly: true, parseLines: true });

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.margin3, styles.inline].join(' ')}>
            <span className={styles.title}>#{message.id}</span>
            {jiraUrl ? (
              <span className={styles.marginLeft}>
                <Button status="link" title={jiraUrl} onClick={() => openInNewTab(jiraUrl)}>
                  view Jira ticket
                </Button>
              </span>
            ) : !message.id ? (
              <span className={[styles.checkboxText, styles.marginLeft].join(' ')}>
                Create and link new Jira ticket
                <Input
                  type="checkbox"
                  checked={message.jira}
                  onChange={(event) => {
                    this.setState((prevState) => ({
                      message: { ...prevState.message, jira: event.target.checked },
                    }));
                  }}
                />
              </span>
            ) : (
              <></>
            )}
          </span>

          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Exit" onClick={() => cancel()} status="transparent">
              <CloseIcon className={styles.icon} />
            </Button>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button
              className={styles.iconBtn}
              title="Save"
              onClick={() => {
                this.setState({ updatingLog: true });
                save(message, () => this.setState({ updatingLog: false }));
              }}
              status="transparent"
              disabled={updatingLog}
            >
              {updatingLog ? <SpinnerIcon className={styles.spinnerIcon} /> : <SaveIcon className={styles.icon} />}
            </Button>
          </span>
        </div>

        <div className={styles.tags}>
          <span className={styles.label}>Tags:</span>
          <span className={styles.value} style={{ flex: 1 }}>
            <MultiSelect
              options={imageTags}
              selectedValues={message.tagObjects}
              isObject={true}
              displayValue="name"
              onSelect={(selectedOptions) => {
                this.setState((prevState) => ({
                  message: { ...prevState.message, tags: selectedOptions },
                }));
              }}
              placeholder="Select one or several tags"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
          </span>
        </div>

        <div className={styles.description}>
          <div className={[styles.mb1, styles.title].join(' ')}>Message</div>
          <RichTextEditor
            ref={this.richTextEditorRef}
            className={styles.textArea}
            defaultValue={htmlMessage}
            onChange={(value) => {
              const parsedValue = htmlToJiraMarkdown(value);
              this.setState((prevState) => ({ message: { ...prevState.message, message_text: parsedValue } }));
            }}
          />
        </div>

        <div className={styles.footer}>
          <div>
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

            <div className={styles.toAttachFiles}>
              <MultiFileUploader
                values={message.file}
                handleFiles={(files) =>
                  this.setState((prevState) => ({ message: { ...prevState.message, file: files } }))
                }
                handleDelete={(file) => {
                  const files = { ...message.file };
                  delete files[file];
                  this.setState((prevState) => ({ message: { ...prevState.message, file: files } }));
                }}
                handleDeleteAll={() =>
                  this.setState((prevState) => ({ message: { ...prevState.message, file: undefined } }))
                }
              />
            </div>

            <div className={styles.flag}>
              <span className={styles.label}>Exposure Flag</span>
              <Select
                value={message.exposure_flag}
                onChange={(event) =>
                  this.setState((prevState) => ({
                    message: { ...prevState.message, exposure_flag: event.value },
                  }))
                }
                options={EXPOSURE_FLAG_OPTIONS}
                className={[styles.select, styles.capitalize].join(' ')}
                small
              />
              <FlagIcon
                title={message.exposure_flag}
                status={this.statusFlag(message.exposure_flag)}
                className={styles.iconFlag}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
