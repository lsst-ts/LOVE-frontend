import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import LaunchScriptIcon from 'components/icons/ScriptQueue/LaunchScriptIcon/LaunchScriptIcon';
import ErrorIcon from 'components/icons/ErrorIcon/ErrorIcon';
import {
  SCRIPTQUEUE_SCRIPT_LOCATION,
  SCRIPTQUEUE_EMPTY_SCHEMA_STRING,
  SCRIPT_SCHEMA_VALIDATION_ERROR_TITLES_MAPPING,
} from 'Config';
import ManagerInterface, { formatSecondsToDigital, parseScriptSchemaError } from 'Utils';
import styles from './NightPlanning.module.css';

const RUN_SCRIPT_LOG_LEVEL = 10;

const statusToStyle = {
  PASSED: styles.passed,
  FAILED: styles.failed,
};

const getScriptQueueSalindexFromScriptPath = (scriptPath) => {
  if (scriptPath.includes('maintel')) {
    return 2;
  } else if (scriptPath.includes('auxtel')) {
    return 1;
  }
  return 0;
};

function StatusLabel({ status }) {
  const statusStyle = statusToStyle[status];
  return <div className={[styles.statusLabel, statusStyle].join(' ')}>{status}</div>;
}

function TestCycleDetails({
  id,
  title,
  description,
  folder,
  status,
  release_version,
  iteration,
  owner,
  planned_start_date,
  planned_end_date,
  extra_fields,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderTestCycleDetailField = ({ value, title, type }) => {
    if (type === 'checkbox') {
      return (
        <div className={styles.testCycleField}>
          <div>{title}</div>
          <input type="checkbox" checked={value} readOnly={true} />
        </div>
      );
    }
    return (
      <div className={styles.testCycleField}>
        <div>{title}</div>
        <div className={styles.fontHighligthed}>{value}</div>
      </div>
    );
  };

  return (
    <div className={styles.testCycleDetailsContainer}>
      <div className={styles.testCycleHeader}>
        <div className={styles.testCycleTitle}>
          <div>
            {id} - {title}
          </div>
          <div
            onClick={toggleShowDetails}
            className={[styles.testCycleDetailsShowBtn, showDetails ? '' : styles.hideDetails].join(' ')}
          >
            ▲
          </div>
        </div>
      </div>
      <div className={[styles.testCycleDetails, showDetails ? '' : styles.hideDetails].join(' ')}>
        <div className={styles.testCycleMainDetails}>
          <div className={styles.fontHighligthed}>{description}</div>
          <div>
            <span>Owner: </span>
            <span className={styles.fontHighligthed}>{owner}</span> ●<span> Planned Start Date: </span>
            <span className={styles.fontHighligthed}>{planned_start_date}</span> ●<span> Planned End Date: </span>
            <span className={styles.fontHighligthed}>{planned_end_date}</span>
          </div>
        </div>
        <div className={styles.testCycleSectionTitle}>More information</div>
        <div className={styles.testCycleExtraFields}>
          {extra_fields?.map((field) => renderTestCycleDetailField(field))}
        </div>
      </div>
    </div>
  );
}

function TestCaseStep({
  position,
  title,
  status,
  test_data,
  expected_result,
  sal_script,
  is_external,
  script_configuration,
  actual_result,
  queueOn,
  scriptSchema,
  commandExecutePermission,
  launchScript,
}) {
  const [scriptSchemaError, setScriptSchemaError] = useState('');
  const [actualResult, setActualResult] = useState(actual_result);

  useEffect(() => {
    if (scriptSchema?.includes(SCRIPTQUEUE_EMPTY_SCHEMA_STRING)) {
      setScriptSchemaError('');
    } else if (!scriptSchema) {
      setScriptSchemaError('WAITING FOR SCHEMA: schema not yet loaded');
    } else {
      ManagerInterface.requestConfigValidation(script_configuration, scriptSchema)
        .then((r) => {
          if (!r.ok) {
            return {
              title: SCRIPT_SCHEMA_VALIDATION_ERROR_TITLES_MAPPING.SERVER_ERROR,
              error: {
                message: 'Unkown error validating json schema on the server',
              },
            };
          }
          return r.json();
        })
        .then((r) => {
          const parsedError = parseScriptSchemaError(r);
          if (r.error) {
            setScriptSchemaError(`${parsedError.title}: ${parsedError.message}`);
          } else {
            setScriptSchemaError('');
          }
        });
    }
  }, [script_configuration, scriptSchema]);

  const updateActualResult = () => {
    const payload = {
      request_type: 'narrative',
      level: 0,
      is_human: true,
      date_begin: new Date().toISOString().slice(0, -1),
      date_end: new Date().toISOString().slice(0, -1),
      message_text: actualResult,
    };
    ManagerInterface.createMessageNarrativeLogs(payload).then((r) => {
      console.log(r);
    });
  };

  return (
    <div className={styles.testCaseStep}>
      <div className={styles.stepStatus}>
        <div>{status}</div>
      </div>
      <div className={styles.stepNumber}>{position}</div>
      <div className={styles.stepFields}>
        <div className={styles.stepField}>
          <div>Step</div>
          <div className={styles.fontHighligthed}>{title}</div>
        </div>
        <div className={styles.stepField}>
          <div>Test Data</div>
          <div className={styles.fontHighligthed}>{test_data}</div>
        </div>
        <div className={styles.stepField}>
          <div>Expected Result</div>
          <div className={styles.fontHighligthed}>{expected_result}</div>
        </div>
        <div className={styles.stepField}>
          <div>SAL Script Name</div>
          <div className={[styles.fontHighligthed, styles.stepSalScript].join(' ')}>
            {sal_script}
            {commandExecutePermission && !scriptSchemaError && (
              <Button
                className={styles.runScriptButton}
                size="extra-small"
                title={queueOn ? 'Run script' : 'Script queue is off'}
                onClick={launchScript}
                disabled={!queueOn}
              >
                <span>Run script</span>
                <span>
                  <LaunchScriptIcon />
                </span>
              </Button>
            )}
          </div>
        </div>
        <div className={styles.stepField}>
          <div>External</div>
          <div className={styles.fontHighligthed}>{is_external ? 'Yes' : 'No'}</div>
        </div>
        <div className={[styles.stepField, styles.stepSalScriptConfig].join(' ')}>
          <div className={styles.stepFieldLabel}>
            <span>Script Configuration</span>
            {scriptSchemaError && <ErrorIcon />}
          </div>
          <div className={styles.stepSalScriptConfigError}>{scriptSchemaError}</div>
          <div className={styles.fontHighligthed}>{script_configuration || 'None'}</div>
        </div>
        <div className={[styles.stepField, styles.stepActualResult].join(' ')}>
          <div>Actual Result</div>
          <div className={styles.fontHighligthed}>
            <TextArea value={actualResult} callback={setActualResult} />
            <Button
              className={styles.saveActualResultButton}
              size="extra-small"
              title="Save actual result"
              onClick={updateActualResult}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

TestCaseStep.propTypes = {
  /** Position of the step in the test case */
  position: PropTypes.number,
  /** Title of the step */
  title: PropTypes.string,
  /** Status of the step
   * One of: PASSED, FAILED, NOT EXECUTED
   */
  status: PropTypes.string,
  /** Test data used in the step */
  test_data: PropTypes.string,
  /** Expected result of the step */
  expected_result: PropTypes.string,
  /** SAL script name */
  sal_script: PropTypes.string,
  /** If the script is external */
  is_external: PropTypes.bool,
  /** Configuration of the script */
  script_configuration: PropTypes.string,
  /** Actual result of the step */
  actual_result: PropTypes.string,
  /** If the queue is ready to receive commands */
  queueOn: PropTypes.bool,
  /** The schema of the script */
  scriptSchema: PropTypes.string,
  /** Command execute permission */
  commandExecutePermission: PropTypes.bool,
  /** Function to launch the script */
  launchScript: PropTypes.func,
};

function TestExecutionDetails({
  id,
  version,
  title,
  status,
  environment,
  release_version,
  executed_by,
  executed_time,
  iteration,
  assignee,
  estimated_time,
  objective,
  precondition,
  comment,
  issues,
  attachments,
  steps,
  username,
  commandExecutePermission,
  getScriptQueueOn,
  getScriptSchema,
  requestSALCommand,
}) {
  const digitalExecutedTime = formatSecondsToDigital(executed_time);
  const executedTimeProgress = (executed_time / estimated_time) * 100;
  return (
    <div className={styles.testCaseDetails}>
      <div className={styles.testCaseHeader}>
        <div className={styles.testCaseTitle}>
          <div>
            {id} ({version}) <span className={styles.fontHighligthed}>{title}</span>
          </div>
          <ProgressBar
            completed={executedTimeProgress}
            targetValue={executedTimeProgress}
            hideCompleted={true}
            title={`Executed ${executed_time}s of Estimated ${estimated_time}s`}
          />
        </div>
        <div className={styles.testCaseStatus}>
          <StatusLabel status={status} />
          <div className={styles.testCaseExecutedTime}>{digitalExecutedTime}</div>
        </div>
      </div>
      <div className={styles.testCaseSectionTitle}>Execution</div>
      <div className={styles.testCaseExecution}>
        <div className={styles.testCaseExecutionField}>
          <div>Environment:</div>
          <div className={styles.fontHighligthed}>{environment}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Iteration:</div>
          <div className={styles.fontHighligthed}>{iteration}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Release Version:</div>
          <div className={styles.fontHighligthed}>{release_version}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Assigned to:</div>
          <div className={styles.fontHighligthed}>{assignee}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Executed By:</div>
          <div className={styles.fontHighligthed}>{executed_by}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Estimated time:</div>
          <div className={styles.fontHighligthed}>{estimated_time}s</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Executed time:</div>
          <div className={styles.fontHighligthed}>{executed_time}s</div>
        </div>
      </div>
      <div className={styles.testCaseSectionTitle}>Objective</div>
      <div className={styles.fontHighligthed}>{objective}</div>
      <div className={styles.testCaseSectionTitle}>Precondition</div>
      <div className={styles.fontHighligthed}>{precondition}</div>
      <div className={styles.testCaseSectionTitle}>Comment</div>
      <div className={styles.fontHighligthed}>{comment}</div>
      <div className={styles.testCaseSectionTitle}>Issues</div>
      <div className={styles.fontHighligthed}>
        {issues?.length > 0
          ? issues.map((issue) => (
              <div>
                {issue.id} {issue.title} {issue.status}
              </div>
            ))
          : 'None'}
      </div>
      <div className={styles.testCaseSectionTitle}>Attachments</div>
      <div className={styles.fontHighligthed}>
        {attachments?.length > 0
          ? attachments.map((attachment) => (
              <div>
                {attachment.title} {attachment.url}
              </div>
            ))
          : 'None'}
      </div>
      <div className={styles.testCaseSectionTitle}>Test Script</div>
      <div>
        {steps?.map((step, i) => {
          const fullScriptPath = /* 'data/scripts/' + */ step.sal_script;
          const queueIndex = getScriptQueueSalindexFromScriptPath(step.sal_script);
          const isQueueOn = getScriptQueueOn(queueIndex);
          const scriptSchema = getScriptSchema(queueIndex, fullScriptPath);
          const launchScript = () => {
            if (!isQueueOn) return;
            const params = {
              isStandard: !step.is_external,
              path: fullScriptPath,
              config: step.script_configuration,
              descr: `description\n\n-------\nSent by ${username}`,
              location: SCRIPTQUEUE_SCRIPT_LOCATION.FIRST,
              logLevel: RUN_SCRIPT_LOG_LEVEL,
            };
            requestSALCommand({
              cmd: 'cmd_add',
              component: 'ScriptQueue',
              salindex: queueIndex,
              params,
            });
          };
          return (
            <TestCaseStep
              queueOn={isQueueOn}
              scriptSchema={scriptSchema}
              commandExecutePermission={commandExecutePermission}
              launchScript={launchScript}
              position={i + 1}
              {...step}
            />
          );
        })}
      </div>
    </div>
  );
}

TestExecutionDetails.propTypes = {
  /** ID of the test case */
  id: PropTypes.string,
  /** Version of the test case */
  version: PropTypes.string,
  /** Title of the test case */
  title: PropTypes.string,
  /** Status of the test case
   * One of: PASSED, FAILED
   */
  status: PropTypes.string,
  /** Environment of the test case */
  environment: PropTypes.string,
  /** Release version of the test case */
  release_version: PropTypes.string,
  /** Who executed the test case */
  executed_by: PropTypes.string,
  /** Accumulated execution time */
  executed_time: PropTypes.number,
  /** Iteration of the test case */
  iteration: PropTypes.string,
  /** Assignee of the test case */
  assignee: PropTypes.string,
  /** Estimated time to complete the test case */
  estimated_time: PropTypes.number,
  /** Objective of the test case */
  objective: PropTypes.string,
  /** Precondition of the test case */
  precondition: PropTypes.string,
  /** Comment of the test case */
  comment: PropTypes.string,
  /** Issues found during the execution */
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      status: PropTypes.string,
    }),
  ),
  /** Attachments of the test case */
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  /** Steps of the test case */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      status: PropTypes.string,
      test_data: PropTypes.string,
      expected_result: PropTypes.string,
      sal_script: PropTypes.string,
      is_external: PropTypes.bool,
      actual_result: PropTypes.string,
    }),
  ),
  /** Command execute permission */
  commandExecutePermission: PropTypes.bool,
  /** Function to check if the specified queue
   * is ready to receive commands
   */
  getScriptQueueOn: PropTypes.func,
  /** Function to get the schema of a script */
  getScriptSchema: PropTypes.func,
  /** Function to request a SAL command */
  requestSALCommand: PropTypes.func,
};

function TestCase({ id, version, status, title, assignee, environment }) {
  const statusStyle = statusToStyle[status];
  const assigneeInitials = assignee
    .split(' ')
    .map((name) => name[0])
    .join('');
  return (
    <div className={[styles.testCase, statusStyle].join(' ')}>
      <div className={styles.testCaseContent}>
        <div className={styles.testCaseTitle}>
          <strong>
            {id} ({version})
          </strong>{' '}
          {title}
        </div>
        <div className={styles.testCaseEnvironment}>{environment}</div>
      </div>
      <div className={styles.testCaseAssignee}>{assigneeInitials}</div>
    </div>
  );
}

TestCase.propTypes = {
  /** ID of the test case */
  id: PropTypes.string,
  /** Version of the test case */
  version: PropTypes.string,
  /** Status of the test case
   * One of: PASSED, FAILED
   */
  status: PropTypes.string,
  /** Title of the test case */
  title: PropTypes.string,
  /** Assignee of the test case */
  assignee: PropTypes.string,
  /** Environment of the test case */
  environment: PropTypes.string,
};

function NightPlanning({
  username,
  commandExecutePermission,
  getScriptQueueOn,
  getScriptSchema,
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
}) {
  const [selectedTestCycle, setSelectedTestCycle] = useState();
  const [selectedTestCase, setSelectedTestCase] = useState();
  const [testCyclesData, setTestCyclesData] = useState([]);
  const [testCycleData, setTestCycleData] = useState({});
  const [testCasesData, setTestCasesData] = useState([]);
  const [testExecutionData, setTestExecutionData] = useState({});

  useEffect(() => {
    // Subscribe to the streams
    subscribeToStreams();

    // Query night plans
    ManagerInterface.getNightPlanTestCycles().then(setTestCyclesData);

    return () => {
      // Unsubscribe to the streams when the component unmounts
      unsubscribeToStreams();
    };
  }, []);

  useEffect(() => {
    // Query night plan data
    ManagerInterface.getNightPlanTestCycle(selectedTestCycle).then(setTestCycleData);
    ManagerInterface.getNightPlanTestCases(selectedTestCycle).then(setTestCasesData);
  }, [selectedTestCycle]);

  useEffect(() => {
    // Query test case data
    ManagerInterface.getNightPlanTestCaseExecution(selectedTestCase).then(setTestExecutionData);
  }, [selectedTestCase]);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Select
          options={testCyclesData}
          onChange={({ value }) => setSelectedTestCycle(value)}
          value={selectedTestCycle}
          placeholder="Select a test cycle"
        />
      </div>
      <div className={styles.testDetails}>
        <TestCycleDetails {...testCycleData} />
      </div>
      <div className={styles.testPlayer}>
        <div className={styles.testCases}>
          {testCasesData?.map((testCase) => (
            <div key={testCase.id} onClick={() => setSelectedTestCase(testCase.id)}>
              <TestCase {...testCase} />
            </div>
          ))}
        </div>
        <div className={styles.testExecution}>
          <TestExecutionDetails
            username={username}
            commandExecutePermission={commandExecutePermission}
            getScriptQueueOn={getScriptQueueOn}
            getScriptSchema={getScriptSchema}
            requestSALCommand={requestSALCommand}
            {...testExecutionData}
          />
        </div>
      </div>
    </div>
  );
}

NightPlanning.propTypes = {
  /** Username of the user */
  username: PropTypes.string,
  /** Command execute permission */
  commandExecutePermission: PropTypes.bool,
  /** Function to check if the specified queue
   * is ready to receive commands
   */
  getScriptQueueOn: PropTypes.func,
  /** Function to get the schema of a script */
  getScriptSchema: PropTypes.func,
  /** Function to subscribe to the streams */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe to the streams */
  unsubscribeToStreams: PropTypes.func,
  /** Function to request a SAL command */
  requestSALCommand: PropTypes.func,
};

export default NightPlanning;
