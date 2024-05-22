import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/GeneralPurpose/Select/Select';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import { formatSecondsToDigital } from 'Utils';
import styles from './NightPlanning.module.css';

const dummyTestCycles = [
  'BLOCK-R17 - TestCycle AuxTel 1',
  'BLOCK-R18 - TestCycle AuxTel 2',
  'BLOCK-R19 - TestCycle AuxTel 3',
  'BLOCK-R20 - TestCycle AuxTel 4',
];

const dummyTestCases = [
  {
    id: 'BLOCK-T17',
    version: '1.0',
    status: 'PASSED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '2. Late Afternoon',
  },
  {
    id: 'BLOCK-T18',
    version: '1.0',
    status: 'PASSED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '2. Late Afternoon',
  },
  {
    id: 'BLOCK-T19',
    version: '1.0',
    status: 'FAILED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '2. Late Afternoon',
  },
  {
    id: 'BLOCK-T20',
    version: '1.0',
    status: 'PASSED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '3. Early Night',
  },
  {
    id: 'BLOCK-T21',
    version: '1.0',
    status: 'PASSED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '3. Early Night',
  },
  {
    id: 'BLOCK-T22',
    version: '1.0',
    status: 'FAILED',
    title: 'AuxTel Daytime Checkouts',
    assignee: 'Bruno Quint',
    environment: '3. Early Night',
  },
];

const dummyTestExecution = {
  id: 'BLOCK-T17',
  version: '1.0',
  title: 'AuxTel Daytime Checkouts',
  status: 'PASSED',
  environment: '2. Late Afternoon',
  release_version: 'None',
  executed_by: 'Bruno Quint',
  executed_time: 15,
  iteration: 'None',
  assignee: 'Bruno Quint',
  estimated_time: 1200,
  objective: 'Complete AuxTel Daytime Checkouts',
  precondition: 'AuxTel is in a good state',
  comment: 'All tests passed successfully',
  issues: [
    // { id: "BLOCK-T17", title: "AuxTel Daytime Checkouts", status: "PASSED" },
  ],
  attachments: [
    // { title: "AuxTel Daytime Checkouts", url: "http://example.com" },
  ],
  steps: [
    {
      title: 'Enable LATISS',
      status: 'NOT EXECUTED',
      test_data: 'None',
      expected_result: 'Script completes without error. All ATSpectrograph components are enabled.',
      sal_script: 'auxtel/enable_latiss.py',
      is_external: true,
      script_configuration: '',
      actual_result: 'None',
    },
    {
      title: 'Run LATISS checkouts',
      status: 'NOT EXECUTED',
      test_data: 'None',
      expected_result: 'Script completes without error.',
      sal_script: 'auxtel/daytime_checkout/latiss_checkout.py',
      is_external: false,
      script_configuration: '',
      actual_result: 'None',
    },
    {
      title: 'Enable ATCS.',
      status: 'NOT EXECUTED',
      test_data: 'None',
      expected_result: 'Script completes without error. All AuxTel components are in enabled mode.',
      sal_script: 'auxtel/enable_atcs.py',
      is_external: false,
      script_configuration: '',
      actual_result: 'None',
    },
    {
      title: 'ATPneumatics Checkout',
      status: 'NOT EXECUTED',
      test_data: 'None',
      expected_result: 'Script completes without error.',
      sal_script: 'auxtel/daytime_checkout/atpneumatics_checkout.py',
      is_external: false,
      script_configuration: '',
      actual_result: 'None',
    },
  ],
};

const dummyTestCycleDetails = {
  id: 'BLOCK-R17',
  title: 'TestCycle AuxTel 1',
  description: 'Complete AuxTel Checkouts',
  folder: 'None',
  status: 'NOT EXECUTED',
  release_version: 'None',
  iteration: 'None',
  owner: 'Bruno Quint',
  planned_start_date: '2024-04-22',
  planned_end_date: '2024-04-23',
  extra_fields: [
    {
      title: 'TMA walk around done',
      type: 'checkbox',
      value: true,
    },
    {
      title: 'TMA walk around - performed by',
      type: 'text',
      value: 'Bruno Quint',
    },
    {
      title: 'TMA walk around done - comments',
      type: 'text',
      value: 'No comments',
    },
    {
      title: 'TMA ready for use?',
      type: 'checkbox',
      value: true,
    },
    {
      title: 'End of Night - TMA El position',
      type: 'text',
      value: 'Zenith',
    },
    {
      title: 'End of Night - TMA Az position',
      type: 'text',
      value: '0°',
    },
    {
      title: 'End of Night - OSS Power Status',
      type: 'text',
      value: 'Zenith',
    },
    {
      title: 'End of Night - Power Supply Status',
      type: 'text',
      value: 'Zenith',
    },
  ],
};

const statusToStyle = {
  PASSED: styles.passed,
  FAILED: styles.failed,
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
          {extra_fields.map((field) => renderTestCycleDetailField(field))}
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
}) {
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
          <div className={styles.fontHighligthed}>{sal_script}</div>
        </div>
        <div className={styles.stepField}>
          <div>External</div>
          <div className={styles.fontHighligthed}>{is_external ? 'Yes' : 'No'}</div>
        </div>
        <div className={styles.stepField}>
          <div>Script Configuration</div>
          <div className={styles.fontHighligthed}>{script_configuration || 'None'}</div>
        </div>
        <div className={styles.stepField}>
          <div>Actual Result</div>
          <div className={styles.fontHighligthed}>{actual_result}</div>
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
  /** Actual result of the step */
  actual_result: PropTypes.string,
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
        {issues.length > 0
          ? issues.map((issue) => (
              <div>
                {issue.id} {issue.title} {issue.status}
              </div>
            ))
          : 'None'}
      </div>
      <div className={styles.testCaseSectionTitle}>Attachments</div>
      <div className={styles.fontHighligthed}>
        {attachments.length > 0
          ? attachments.map((attachment) => (
              <div>
                {attachment.title} {attachment.url}
              </div>
            ))
          : 'None'}
      </div>
      <div className={styles.testCaseSectionTitle}>Test Script</div>
      <div>
        {steps.map((step, i) => (
          <TestCaseStep position={i + 1} {...step} />
        ))}
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

function NightPlanning(props) {
  const [selectedTestCycle, setSelectedTestCycle] = useState(dummyTestCycles[0]);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Select
          options={dummyTestCycles}
          onChange={({ value }) => setSelectedTestCycle(value)}
          value={selectedTestCycle}
          placeholder="Select a test cycle"
        />
      </div>
      <div className={styles.testDetails}>
        <TestCycleDetails {...dummyTestCycleDetails} />
      </div>
      <div className={styles.testPlayer}>
        <div className={styles.testCases}>
          {dummyTestCases.map((testCase) => (
            <TestCase key={testCase.id} {...testCase} />
          ))}
        </div>
        <div className={styles.testExecution}>
          <TestExecutionDetails {...dummyTestExecution} />
        </div>
      </div>
    </div>
  );
}

NightPlanning.propTypes = {};

export default NightPlanning;
