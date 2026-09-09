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

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import Moment from 'moment';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import BulkSelect from 'components/GeneralPurpose/BulkSelect/BulkSelect';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import RichTextEditor from 'components/GeneralPurpose/RichTextEditor/RichTextEditor';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { EXPOSURE_FLAG_OPTIONS, exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface, {
  getFilesURLs,
  getLinkJira,
  htmlToJiraMarkdown,
  jiraMarkdownToHtml,
  openInNewTab,
  getFilename,
  parseTaiToUtc,
} from 'Utils';
import styles from './Exposure.module.css';

const renderDateTimeInput = (props) => <input {...props} readOnly />;

const emptyLog = {
  obs_id: [],
  message_text: '',
  level: 0,
  is_human: true,
  exposure_flag: 'none',
  jira_issue_id: '',
  jira: false,
  // TODO: remove deprecated parameter
  // See: OSW-2932
  is_new: true,
};

const ExposureAdd = ({
  exposure,
  log: propLog = emptyLog,
  isLogCreate = false,
  isMenu = false,
  back,
  view,
  taiToUtc,
}) => {
  const [log, setLog] = useState(() => ({
    ...emptyLog,
    ...propLog,
    obs_id: exposure ? [exposure.obs_id] : emptyLog.obs_id,
  }));
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(exposure?.instrument);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDayExposureStart, setSelectedDayExposureStart] = useState(Moment().subtract(1, 'days'));
  const [selectedDayExposureEnd, setSelectedDayExposureEnd] = useState(Moment());
  const [registryMap, setRegistryMap] = useState({});
  const [updatingExposures, setUpdatingExposures] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [tryingToSave, setTryingToSave] = useState(false);
  const [showBulkSelector, setShowBulkSelector] = useState(false);
  const [exposureIds, setExposureIds] = useState([]);
  const [confirmationModalShown, setConfirmationModalShown] = useState(false);
  const [confirmationModalText, setConfirmationModalText] = useState('');

  const [containerId, _] = useState(uniqueId('exposure-add-container-'));

  const richTextEditorRef = useRef(null);

  useEffect(() => {
    queryInstruments();
    queryExposureTags();
  }, []);

  useEffect(() => {
    if (selectedInstrument && registryMap[selectedInstrument]) {
      queryExposures();
    }
  }, [selectedInstrument, registryMap, selectedDayExposureStart, selectedDayExposureEnd]);

  const clearForm = () => {
    richTextEditorRef.current?.cleanContent();
    setSelectedTags([]);
    setLog({ ...emptyLog });
    setTryingToSave(false);
  };

  const queryExposureTags = () => {
    ManagerInterface.getListImageTags().then((data) => {
      const tagOptions = data.map((tag) => ({ name: tag.label, id: tag.key }));
      setTagOptions(tagOptions);
      if (log.id) {
        setSelectedTags(tagOptions.filter((tag) => log.tags.includes(tag.id)));
      }
    });
  };

  const queryInstruments = () => {
    ManagerInterface.getListExposureInstruments().then((data) => {
      const registryMap = {};
      Object.entries(data).forEach(([key, value]) => {
        value.forEach((instrument) => {
          if (!instrument) return;
          registryMap[instrument] = key;
        });
      });

      const instrumentsArray = Object.keys(registryMap);
      setInstruments(instrumentsArray);
      setRegistryMap(registryMap);
      setSelectedInstrument(instrumentsArray[0]);
    });
  };

  const queryExposures = () => {
    const startObsDay = Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT);
    const endObsDay = Moment(selectedDayExposureEnd).add(1, 'days').format(ISO_INTEGER_DATE_FORMAT);
    const registry = registryMap[selectedInstrument].split('_')[2];

    setUpdatingExposures(true);
    ManagerInterface.getListExposureLogs(selectedInstrument, startObsDay, endObsDay, registry)
      .then((data) => {
        setExposureIds(data.map((exposure) => exposure.obs_id));
      })
      .finally(() => {
        setUpdatingExposures(false);
      });
  };

  const saveMessage = () => {
    setTryingToSave(true);
    if (!isSendAllowed) return;

    const payload = { ...log };

    payload.request_type = 'exposure';
    payload.instrument = selectedInstrument;
    payload.tags = selectedTags.map((tag) => tag.id);
    payload.jira = !!payload.jira_issue_id;

    // Transform &amp; back to '&'. This is a workaround due to Quill editor encoding '&'.}
    payload.message_text = payload.message_text.replace(/&amp;/g, '&');

    setSavingLog(true);
    if (log.id) {
      return ManagerInterface.updateMessageExposureLogs(log.id, payload)
        .then((result) => {
          if (result) {
            clearForm();

            if (view) view();
          }
        })
        .finally(() => {
          setSavingLog(false);
        });
    }
    ManagerInterface.createMessageExposureLogs(payload)
      .then((result) => {
        if (result) {
          clearForm();
        }
      })
      .finally(() => {
        setSavingLog(false);
      });
  };

  const deleteMessage = () => {
    ManagerInterface.deleteMessageExposureLogs(log.id).then(() => {
      setConfirmationModalShown(false);
    });
  };

  const changeDayExposure = (day, type) => {
    if (type === 'start') {
      setSelectedDayExposureStart(day);
    } else if (type === 'end') {
      setSelectedDayExposureEnd(day);
    }
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    saveMessage();
  };

  const setNewMessageObsId = (selectedOptions) => {
    setLog((prevLog) => ({
      ...prevLog,
      obs_id: selectedOptions,
    }));
  };

  const confirmDelete = () => {
    const modalText = (
      <span>
        You are about to <b>delete</b> this message of Exposure Logs
        <br />
        Are you sure?
      </span>
    );
    setConfirmationModalShown(true);
    setConfirmationModalText(modalText);
  };

  const renderInstrumentsSelect = () => {
    return (
      <Select
        value={selectedInstrument}
        onChange={({ value }) => setSelectedInstrument(value)}
        options={instruments}
        className={styles.select}
        small
      />
    );
  };

  const renderDateTimeRangeSelect = () => {
    return (
      <DateTimeRange
        label="From"
        className={styles.dateRange}
        startDate={selectedDayExposureStart}
        endDate={selectedDayExposureEnd}
        startDateProps={{
          timeFormat: false,
          className: styles.rangeDateOnly,
          maxDate: Moment(),
          renderInput: renderDateTimeInput,
        }}
        endDateProps={{
          timeFormat: false,
          className: styles.rangeDateOnly,
          maxDate: Moment(),
          renderInput: renderDateTimeInput,
        }}
        onChange={(day, type) => changeDayExposure(day, type)}
      />
    );
  };

  const renderImageTagsSelect = () => {
    return (
      <>
        <span className={styles.label}>Tags</span>
        <span className={styles.tags}>
          <MultiSelect
            options={tagOptions}
            selectedValues={selectedTags}
            isObject={true}
            displayValue="name"
            onSelect={setSelectedTags}
            onRemove={setSelectedTags}
            placeholder="Select zero or more tags"
          />
        </span>
      </>
    );
  };

  const renderExposuresSelect = () => {
    const toggleBulkSelector = () => {
      setShowBulkSelector((prevState) => !prevState);
    };

    const inputError = tryingToSave && notSelectedExposure;
    return (
      <>
        <div
          title={`Selected ${log.obs_id.length} exposures`}
          className={[
            styles.exposuresMultiSelect,
            showBulkSelector ? styles.hideOverflow : '',
            inputError ? styles.inputError : '',
          ].join(' ')}
        >
          <MultiSelect
            options={exposureIds}
            selectedValues={log.obs_id}
            onSelect={setNewMessageObsId}
            onRemove={setNewMessageObsId}
            placeholder="Select one or several observations"
            selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
            disable={showBulkSelector}
            title="test"
          />
        </div>
        <Button size="extra-small" onClick={toggleBulkSelector}>
          {showBulkSelector ? 'Hide' : 'Show'} bulk selector
        </Button>
      </>
    );
  };

  const renderJiraFields = () => {
    const logHasJira = getLinkJira(log.urls) !== '';
    return (
      <div className={styles.jira}>
        {!logHasJira && (
          <div className={styles.textInput}>
            <Input
              value={log?.jira_issue_id}
              placeholder="Jira ticket id"
              onChange={(event) => {
                setLog((prevLog) => ({
                  ...prevLog,
                  jira_issue_id: event.target.value,
                }));
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button className={styles.borderedButton} onClick={() => setConfirmationModalShown(false)} status="transparent">
          Go back
        </Button>
        <Button onClick={() => deleteMessage()} status="default">
          Yes
        </Button>
      </div>
    );
  };

  const renderRefreshLogsButton = () => {
    return (
      <Button
        className={styles.refreshDataBtn}
        title="Refresh exposures"
        disabled={updatingExposures}
        onClick={() => queryExposures()}
      >
        {updatingExposures ? (
          <SpinnerIcon className={styles.spinnerIcon} />
        ) : (
          <RefreshIcon title="Refresh exposures" className={styles.refreshIcon} />
        )}
      </Button>
    );
  };

  const renderBackButton = () => {
    return (
      <div className={styles.returnToLogs}>
        <Button status="link" onClick={() => back()}>
          <span className={styles.title}>{`< Return to Observations`}</span>
        </Button>
      </div>
    );
  };

  const renderTextEditor = () => {
    const inputError = tryingToSave && messageEmpty;
    return (
      <>
        <span className={styles.title}>Message</span>
        <RichTextEditor
          ref={richTextEditorRef}
          className={[styles.textArea, inputError ? styles.inputError : ''].join(' ')}
          defaultValue={htmlMessage}
          onChange={(value) => {
            const parsedValue = htmlToJiraMarkdown(value);
            setLog((prevLog) => ({
              ...prevLog,
              message_text: parsedValue,
            }));
          }}
          onKeyCombination={(combination) => {
            if (combination === 'ctrl+enter' && !isSubmitDisabled) {
              handleSubmit();
            }
          }}
        />
      </>
    );
  };

  const renderMultiFileUploader = () => {
    return (
      <div className={styles.toAttachFiles}>
        <MultiFileUploader
          values={log?.file}
          handleFiles={(files) =>
            setLog((prevLog) => ({
              ...prevLog,
              file: files,
            }))
          }
          handleDelete={(file) => {
            const files = { ...log?.file };
            delete files[file];
            setLog((prevLog) => ({
              ...prevLog,
              file: files,
            }));
          }}
          handleDeleteAll={() =>
            setLog((prevLog) => ({
              ...prevLog,
              file: undefined,
            }))
          }
        />
      </div>
    );
  };

  const renderExposureFlags = () => {
    return (
      <>
        <div className={styles.label}>Exposure Flag</div>
        <div className={[styles.value, styles.flags].join(' ')}>
          <Select
            value={log?.exposure_flag}
            onChange={(event) =>
              setLog((prevLog) => ({
                ...prevLog,
                exposure_flag: event.value,
              }))
            }
            options={EXPOSURE_FLAG_OPTIONS}
            className={[styles.select, styles.capitalize].join(' ')}
            small
          />
          <FlagIcon title={log?.exposure_flag} status={statusFlag} className={styles.iconFlag} />
        </div>
      </>
    );
  };

  const renderAttachedFiles = () => {
    return (
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
    );
  };

  const renderSaveButton = () => {
    return (
      <Button disabled={isSubmitDisabled} type="Submit">
        {savingLog ? <SpinnerIcon className={styles.spinnerIcon} /> : <span className={styles.title}>Save</span>}
      </Button>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        displayTopBar={false}
        isOpen={confirmationModalShown}
        onRequestClose={() => setConfirmationModalShown(false)}
        parentSelector={() => document.querySelector(`#${containerId}`)}
        size={50}
      >
        <p style={{ textAlign: 'center' }}>{confirmationModalText}</p>
        {renderModalFooter()}
      </Modal>
    );
  };

  const filesUrls = getFilesURLs(log?.urls);
  const htmlMessage = jiraMarkdownToHtml(log?.message_text);
  const statusFlag = exposureFlagStateToStyle[log.exposure_flag] ?? 'unknown';

  // const isEditForm = !!log.id;

  const messageEmpty = !log?.message_text?.trim();
  const notSelectedExposure = log.obs_id.length === 0;
  const isSendAllowed = !messageEmpty && !notSelectedExposure;
  const isSubmitDisabled = tryingToSave && !isSendAllowed;

  if (isMenu) {
    return (
      <div id={containerId}>
        <div className={styles.formWrapper}>
          {showBulkSelector && (
            <BulkSelect options={exposureIds} selectedOptions={log.obs_id} onSelect={setNewMessageObsId} />
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.detailContainerMenu}>
              <div className={styles.headerMenu}>
                <span className={styles.label}>Instruments</span>
                <span className={styles.instrument}>{renderInstrumentsSelect()}</span>

                <span className={styles.label}>Obs. day</span>
                <span>{renderDateTimeRangeSelect()}</span>

                <span className={styles.label}>Obs. Id</span>
                <span className={styles.obsIdSelector}>
                  {renderRefreshLogsButton()}
                  {renderExposuresSelect()}
                </span>
                {renderImageTagsSelect()}
              </div>
              <div className={styles.contentMenu}>{renderTextEditor()}</div>
              <div className={styles.footerMenu}>
                <div>
                  {renderMultiFileUploader()}
                  {renderExposureFlags()}
                  {renderJiraFields()}
                </div>

                <div className={styles.footerRightMenu}>{renderSaveButton()}</div>
              </div>
            </div>
          </form>
        </div>
        {renderModal()}
      </div>
    );
  }

  return (
    <div id={containerId} className={styles.container}>
      {back && renderBackButton()}
      <div className={styles.formWrapper}>
        {showBulkSelector && (
          <BulkSelect options={exposureIds} selectedOptions={log.obs_id} onSelect={setNewMessageObsId} />
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              {log?.id ? (
                <span className={styles.title}>#{log.id}</span>
              ) : (
                <>
                  <span className={styles.label}>Instruments</span>
                  <span className={styles.instrument}>{renderInstrumentsSelect()}</span>

                  {renderDateTimeRangeSelect()}

                  <span className={styles.label}>Obs. Id</span>
                  <span className={styles.obsIdSelector}>
                    {renderRefreshLogsButton()}
                    {renderExposuresSelect()}
                  </span>
                </>
              )}

              {log?.id && (
                <div className={styles.rightSection}>
                  <Button className={styles.iconBtn} title="View" onClick={() => view()} status="transparent">
                    <CloseIcon className={styles.icon} />
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.header}>
              {renderExposureFlags()}
              {renderImageTagsSelect()}
            </div>

            <div className={styles.content}>{renderTextEditor()}</div>

            <div className={styles.footer}>
              <div>
                {!isLogCreate && renderAttachedFiles()}
                {renderJiraFields()}
                {renderMultiFileUploader()}
              </div>
              {renderSaveButton()}
            </div>
          </div>
        </form>
      </div>
      {renderModal()}
    </div>
  );
};

ExposureAdd.propTypes = {
  /** Exposure object to which a log is going to be added */
  exposure: PropTypes.object,
  /** Log object */
  log: PropTypes.object,
  /** Flag to show the creation components */
  isLogCreate: PropTypes.bool,
  /** Flag to show the menu components */
  isMenu: PropTypes.bool,
  /** Function to go back */
  back: PropTypes.func,
  /** Function to view a log */
  view: PropTypes.func,
};

export default memo(ExposureAdd);
