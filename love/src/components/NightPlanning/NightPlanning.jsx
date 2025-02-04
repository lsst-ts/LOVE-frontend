import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import LaunchScriptIcon from 'components/icons/ScriptQueue/LaunchScriptIcon/LaunchScriptIcon';
import ErrorIcon from 'components/icons/ErrorIcon/ErrorIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import {
  SCRIPTQUEUE_SCRIPT_LOCATION,
  SCRIPTQUEUE_EMPTY_SCHEMA_STRING,
  SCRIPT_SCHEMA_VALIDATION_ERROR_TITLES_MAPPING,
} from 'Config';
import ManagerInterface, { formatSecondsToDigital, parseScriptSchemaError } from 'Utils';
import styles from './NightPlanning.module.css';

const RUN_SCRIPT_LOG_LEVEL = 10;

const TEST_EXECUTION_STATUSES = {
  NOT_EXECUTED: 'Not Executed',
  IN_PROGRESS: 'In Progress',
  PASS: 'Pass',
  PASS_WITH_DEVIATION: 'Pass with Deviation',
  FAIL: 'Fail',
  SKIP: 'Skip',
  BLOCKED: 'Blocked',
};

const statusToStyle = {
  [TEST_EXECUTION_STATUSES.NOT_EXECUTED]: styles.notExecuted,
  [TEST_EXECUTION_STATUSES.IN_PROGRESS]: styles.inProgress,
  [TEST_EXECUTION_STATUSES.PASS]: styles.passed,
  [TEST_EXECUTION_STATUSES.PASS_WITH_DEVIATION]: styles.passedWithDeviation,
  [TEST_EXECUTION_STATUSES.FAIL]: styles.failed,
  [TEST_EXECUTION_STATUSES.SKIP]: styles.skipped,
  [TEST_EXECUTION_STATUSES.BLOCKED]: styles.blocked,
};

function getScriptQueueSalindexFromScriptPath(scriptPath) {
  return 1;
  // if (scriptPath.includes('maintel')) {
  //   return 2;
  // } else if (scriptPath.includes('auxtel')) {
  //   return 1;
  // }
  // return 0;
}

function validateScriptConfiguration(scriptConfig) {
  if (scriptConfig === '(none)') {
    return '';
  }
  return scriptConfig;
}

function stepIsScript(scriptPath) {
  return scriptPath.includes('.py');
}

function StatusLabel({ status }) {
  const executionStatus = status ?? TEST_EXECUTION_STATUSES.NOT_EXECUTED;
  const statusStyle = statusToStyle[executionStatus];
  return <div className={[styles.statusLabel, statusStyle].join(' ')}>{executionStatus}</div>;
}

function TestCycleDetails({
  isLoading,
  cycleKey,
  name,
  description,
  folder,
  status,
  owner,
  plannedStartDate,
  plannedEndDate,
  customFields,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderCustomField = (key, value, type) => {
    if (type === 'checkbox') {
      return (
        <div className={styles.testCycleField}>
          <div>{key}</div>
          {/* <input type="checkbox" checked={value} readOnly={true} /> */}
          <span>{value ? '✅️' : '❌'}</span>
        </div>
      );
    }
    return (
      <div className={styles.testCycleField}>
        <div>{key}</div>
        <div className={styles.fontHighligthed}>{value || 'None'}</div>
      </div>
    );
  };

  const parsedCustomFields = Object.entries(customFields || {}).map(([key, value]) => {
    let fieldType = 'text';
    if (typeof value === 'boolean') {
      fieldType = 'checkbox';
    }
    return {
      key,
      value,
      type: fieldType,
    };
  });

  if (isLoading) {
    return (
      <div className={styles.testCycleDetailsContainer}>
        <div className={styles.testCycleHeader}>
          <div className={styles.testCycleTitle}>
            <SpinnerIcon className={styles.spinnerIcon} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.testCycleDetailsContainer}>
      <div className={styles.testCycleHeader}>
        <div className={styles.testCycleTitle}>
          <div>
            {cycleKey} - {name}
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
        <hr></hr>
        <div className={styles.testCycleMainDetails}>
          <div className={styles.basicInformation}>
            <span>Owner: </span>
            <span className={styles.fontHighligthed}>{owner ?? 'None'}</span>
            <span>● Planned Start Date: </span>
            <span className={styles.fontHighligthed}>{plannedStartDate ?? 'None'}</span>
            <span>● Planned End Date: </span>
            <span className={styles.fontHighligthed}>{plannedEndDate ?? 'None'}</span>
          </div>
          {description && (
            <>
              <hr></hr>
              {/* <div className={styles.fontHighligthed}>{description}</div> */}
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </>
          )}
        </div>
        {customFields && (
          <>
            <hr></hr>
            <div className={styles.testCycleSectionTitle}>More information</div>
            <div className={styles.testCycleExtraFields}>
              {parsedCustomFields.map(({ key, value, type }) => renderCustomField(key, value, type))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

TestCycleDetails.propTypes = {
  /** If the test cycle details are loading */
  isLoading: PropTypes.bool,
  /** Key of the test cycle */
  cycleKey: PropTypes.string,
  /** Name of the test cycle */
  name: PropTypes.string,
  /** Description of the test cycle */
  description: PropTypes.string,
  /** Folder of the test cycle */
  folder: PropTypes.string,
  /** Status of the test cycle */
  status: PropTypes.string,
  /** Owner of the test cycle */
  owner: PropTypes.string,
  /** Planned start date of the test cycle */
  plannedStartDate: PropTypes.string,
  /** Planned end date of the test cycle */
  plannedEndDate: PropTypes.string,
  /** Custom fields of the test cycle */
  customFields: PropTypes.object,
};

function TestCaseStep({
  status,
  description,
  testData,
  expectedResult,
  salScript,
  isExternal,
  scriptConfiguration,
  actualResult,
  position,
  queueOn,
  scriptSchema,
  commandExecutePermission,
  launchScript,
  loadScriptSchema,
}) {
  const [scriptSchemaError, setScriptSchemaError] = useState('');
  const [actualResultState, setActualResultState] = useState(actualResult);

  const isScript = stepIsScript(salScript);

  if (isScript) {
    useEffect(() => {
      if (scriptSchema?.includes(SCRIPTQUEUE_EMPTY_SCHEMA_STRING)) {
        setScriptSchemaError('');
      } else if (!scriptSchema) {
        setScriptSchemaError('WAITING FOR SCHEMA: schema not yet loaded');
      } else {
        ManagerInterface.requestConfigValidation(scriptConfiguration, scriptSchema)
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
    }, [scriptConfiguration, scriptSchema]);
  }

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
        <StatusLabel status={status} />
      </div>
      <div className={styles.stepNumber}>{position}</div>
      <div className={styles.stepFields}>
        <div className={styles.stepField}>
          <div>Step</div>
          {/* <div className={styles.fontHighligthed}>{description ?? 'None'}</div> */}
          <div className={styles.fontHighligthed} dangerouslySetInnerHTML={{ __html: description ?? 'None' }} />
        </div>
        <div className={styles.stepField}>
          <div>Test Data</div>
          <div className={styles.fontHighligthed}>{testData ?? 'None'}</div>
        </div>
        <div className={styles.stepField}>
          <div>Expected Result</div>
          {/* <div className={styles.fontHighligthed}>{expectedResult ?? 'None'}</div> */}
          <div className={styles.fontHighligthed} dangerouslySetInnerHTML={{ __html: expectedResult ?? 'None' }} />
        </div>
        <div className={styles.stepField}>
          <div>SAL Script Name</div>
          <div className={[styles.fontHighligthed, styles.stepSalScript].join(' ')}>
            {salScript}
            {isScript && commandExecutePermission && !scriptSchemaError && (
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
          <div className={styles.fontHighligthed}>{isExternal ? 'Yes' : 'No'}</div>
        </div>
        <div className={[styles.stepField, styles.stepSalScriptConfig].join(' ')}>
          <div className={styles.stepFieldLabel}>
            <span>Script Configuration</span>
            {scriptSchemaError && <ErrorIcon />}
            {scriptSchemaError.includes('WAITING FOR SCHEMA') && (
              <Button
                className={styles.requestSchemaButton}
                size="extra-small"
                title="Load script schema"
                onClick={loadScriptSchema}
              >
                Load schema
              </Button>
            )}
          </div>
          <div className={styles.stepSalScriptConfigError}>{scriptSchemaError}</div>
          <div className={styles.fontHighligthed}>{scriptConfiguration || 'None'}</div>
        </div>
        <div className={[styles.stepField, styles.stepActualResult].join(' ')}>
          <div>Actual Result</div>
          <div className={styles.fontHighligthed}>
            <TextArea value={actualResultState} callback={setActualResultState} />
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
  isLoading,
  version,
  testExecutionStatus,
  environment,
  release_version,
  executedById,
  iteration,
  assignedToId,
  executionTime,
  estimatedTime,
  comment,
  issues,
  attachments,
  testCaseData,
  testStepsData,
  username,
  commandExecutePermission,
  getScriptQueueOn,
  getScriptSchema,
  requestSALCommand,
}) {
  const executionTimeSeconds = executionTime ? executionTime / 1000 : 0;
  const estimatedTimeSeconds = estimatedTime ? estimatedTime / 1000 : 0;

  const digitalExecutedTime = executionTimeSeconds ? formatSecondsToDigital(executionTimeSeconds) : '00:00:00';
  const executedTimeProgress =
    executionTimeSeconds && estimatedTimeSeconds ? (executionTimeSeconds / estimatedTimeSeconds) * 100 : 0;

  const testCaseKey = testCaseData?.key;
  const testCaseName = testCaseData?.name;
  const testCaseObjective = testCaseData?.objective;
  const testCasePrecondition = testCaseData?.precondition;

  if (isLoading) {
    return <div title="Loading test execution..." className="indeterminate"></div>;
  }

  return (
    <div className={styles.testCaseDetails}>
      <div className={styles.testCaseHeader}>
        <div className={styles.testCaseTitle}>
          <div>
            {testCaseKey}
            {version ? ` - (${version})` : ''}
            <span className={styles.fontHighligthed}> - {testCaseName}</span>
          </div>
          <ProgressBar
            completed={executedTimeProgress}
            targetValue={executedTimeProgress}
            hideCompleted={true}
            title={`Executed ${executionTimeSeconds}s of Estimated ${estimatedTimeSeconds}s`}
          />
        </div>
        <div className={styles.testCaseStatus}>
          <StatusLabel status={testExecutionStatus} />
          <div className={styles.testCaseExecutedTime}>{digitalExecutedTime}</div>
        </div>
      </div>
      <div className={styles.testCaseSectionTitle}>Execution</div>
      <div className={styles.testCaseExecution}>
        <div className={styles.testCaseExecutionField}>
          <div>Environment:</div>
          <div className={styles.fontHighligthed}>{environment ?? 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Iteration:</div>
          <div className={styles.fontHighligthed}>{iteration ?? 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Release Version:</div>
          <div className={styles.fontHighligthed}>{release_version ?? 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Assigned to:</div>
          <div className={styles.fontHighligthed}>{assignedToId ?? 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Executed By:</div>
          <div className={styles.fontHighligthed}>{executedById ?? 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Estimated time:</div>
          <div className={styles.fontHighligthed}>{estimatedTimeSeconds ? `${estimatedTimeSeconds}s` : 'None'}</div>
        </div>
        <div className={styles.testCaseExecutionField}>
          <div>Executed time:</div>
          <div className={styles.fontHighligthed}>{executionTimeSeconds ? `${executionTimeSeconds}s` : 'None'}</div>
        </div>
      </div>
      <div className={styles.testCaseSectionTitle}>Objective</div>
      {/* <div className={styles.fontHighligthed}>{testCaseObjective ?? 'None'}</div> */}
      <div className={styles.fontHighligthed} dangerouslySetInnerHTML={{ __html: testCaseObjective ?? 'None' }} />
      <div className={styles.testCaseSectionTitle}>Precondition</div>
      {/* <div className={styles.fontHighligthed}>{testCasePrecondition ?? 'None'}</div> */}
      <div className={styles.fontHighligthed} dangerouslySetInnerHTML={{ __html: testCasePrecondition ?? 'None' }} />
      <div className={styles.testCaseSectionTitle}>Comment</div>
      <div className={styles.fontHighligthed}>{comment ?? 'None'}</div>
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
      <hr />
      <div>
        {testStepsData?.map((step, i) => {
          const stepCustomFields = step.customFields ?? {};
          step['salScript'] = stepCustomFields['SAL Script Name'];
          step['isExternal'] = stepCustomFields['External SAL Script?'];
          step['scriptConfiguration'] = validateScriptConfiguration(stepCustomFields['SAL Script Configuration']);

          const fullScriptPath = /* 'data/scripts/' + */ step.salScript;
          const queueIndex = getScriptQueueSalindexFromScriptPath(step.salScript);
          const isQueueOn = getScriptQueueOn(queueIndex);
          const scriptSchema = getScriptSchema(queueIndex, fullScriptPath);

          const launchScript = () => {
            if (!isQueueOn) return;
            const params = {
              isStandard: !step.isExternal,
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

          const loadScriptSchema = () => {
            const payload = {
              component: 'ScriptQueue',
              salindex: queueIndex,
              cmd: 'cmd_showSchema',
              params: {
                path: fullScriptPath,
                isStandard: !step.isExternal,
              },
            };
            requestSALCommand(payload);
          };

          return (
            <TestCaseStep
              key={i}
              queueOn={isQueueOn}
              scriptSchema={scriptSchema}
              commandExecutePermission={commandExecutePermission}
              launchScript={launchScript}
              loadScriptSchema={loadScriptSchema}
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
   * One of: PASSED, FAILED, NOT_EXECUTED
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

function TestCase({ caseKey, name, version, executionStatus, executionAssignee, executionEnvironment }) {
  const statusStyle = statusToStyle[executionStatus];
  const assigneeInitials = executionAssignee
    .split(' ')
    .map((name) => name[0])
    .join('');
  return (
    <div className={[styles.testCase, statusStyle].join(' ')}>
      <div className={styles.testCaseContent}>
        <div className={styles.testCaseTitle}>
          <strong>
            {caseKey} ({version})
          </strong>{' '}
          {name}
        </div>
        <div className={styles.testCaseEnvironment}>{executionEnvironment}</div>
      </div>
      <div className={styles.testCaseAssignee}>{assigneeInitials}</div>
    </div>
  );
}

TestCase.propTypes = {
  /** Key of the test case */
  caseKey: PropTypes.string,
  /** Name of the test case */
  name: PropTypes.string,
  /** Version of the test case */
  version: PropTypes.string,
  /** Status of the test execution of the test case
   * One of: PASSED, FAILED, NOT_EXECUTED
   */
  executionStatus: PropTypes.string,
  /** Assignee of the test execution of the test case */
  executionAssignee: PropTypes.string,
  /** Environment of the test execution of the test case */
  executionEnvironment: PropTypes.string,
};

function TestCases({ isLoading, testCasesData, setSelectedTestCase }) {
  if (isLoading) {
    return <div title="Loading test cases..." className="indeterminate" />;
  }
  return (
    <>
      {testCasesData?.map((testCase) => (
        <div key={testCase.id} onClick={() => setSelectedTestCase(testCase.executionKey)}>
          <TestCase caseKey={testCase.key} {...testCase} />
        </div>
      ))}
    </>
  );
}

TestCases.propTypes = {
  /** If the test cases are loading */
  isLoading: PropTypes.bool,
  /** Data of the test cases */
  testCasesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      version: PropTypes.string,
      status: PropTypes.string,
      title: PropTypes.string,
      assignee: PropTypes.string,
      environment: PropTypes.string,
    }),
  ),
  /** Function to set the selected test case */
  setSelectedTestCase: PropTypes.func,
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
  const [testCyclesLoading, setTestCyclesLoading] = useState(false);
  const [testCycleLoading, setTestCycleLoading] = useState(false);
  const [testCasesLoading, setTestCasesLoading] = useState(false);
  const [testExecutionLoading, setTestExecutionLoading] = useState(false);

  useEffect(() => {
    // Subscribe to the streams
    subscribeToStreams();

    // Query night plans
    setTestCyclesLoading(true);
    ManagerInterface.getNightPlanTestCycles()
      .then((data) => {
        if (data) {
          const sortedData = data.toSorted((a, b) => b.id - a.id);
          setTestCyclesData(sortedData.map((c) => c.key));
        }
      })
      .finally(() => {
        setTestCyclesLoading(false);
      });

    return () => {
      // Unsubscribe to the streams when the component unmounts
      unsubscribeToStreams();
    };
  }, []);

  useEffect(() => {
    // Query night plan data
    if (!selectedTestCycle) return;
    setTestCycleLoading(true);
    setTestCasesLoading(true);
    ManagerInterface.getNightPlanTestCycle(selectedTestCycle)
      .then(setTestCycleData)
      .finally(() => {
        setTestCycleLoading(false);
      });
    ManagerInterface.getNightPlanTestCases(selectedTestCycle)
      .then(setTestCasesData)
      .finally(() => {
        setTestCasesLoading(false);
      });
  }, [selectedTestCycle]);

  useEffect(() => {
    // Query test case data
    if (!selectedTestCase) return;
    setTestExecutionLoading(true);
    ManagerInterface.getNightPlanTestCaseExecution(selectedTestCase)
      .then(setTestExecutionData)
      .finally(() => {
        setTestExecutionLoading(false);
      });
  }, [selectedTestCase]);

  const handleTestCaseClick = (testCaseKey) => {
    if (testExecutionLoading) return;
    setSelectedTestCase(testCaseKey);
  };

  const testCycleSelectorIsDisabled = testCyclesLoading || testCycleLoading || testCasesLoading;

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Select
          options={testCyclesData}
          onChange={({ value }) => setSelectedTestCycle(value)}
          value={selectedTestCycle}
          placeholder="Select a test cycle"
          disabled={testCycleSelectorIsDisabled}
        />
        {testCyclesLoading && <div>Loading...</div>}
      </div>
      <div className={styles.testDetails}>
        <TestCycleDetails isLoading={testCycleLoading} cycleKey={testCycleData.key} {...testCycleData} />
      </div>
      <div className={styles.testPlayer}>
        <div className={[styles.testCases, testExecutionLoading ? styles.executionLoading : ''].join(' ')}>
          <TestCases
            isLoading={testCasesLoading}
            isLoadingExecution={testExecutionLoading}
            testCasesData={testCasesData}
            setSelectedTestCase={handleTestCaseClick}
          />
        </div>
        <div className={styles.testExecution}>
          <TestExecutionDetails
            isLoading={testExecutionLoading}
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
