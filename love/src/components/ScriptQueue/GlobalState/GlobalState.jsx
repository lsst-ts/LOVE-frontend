import React from 'react';
import PropTypes from 'prop-types';
import styles from './GlobalState.module.css';
import scriptStyles from '../Scripts/Scripts.module.css';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import GearIcon from 'components/icons/GearIcon/GearIcon.jsx';
import ContextMenu from '../Scripts/ContextMenu/ContextMenu';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail.jsx';

const summaryStateToStylesMap = Object.values(CSCDetail.states).reduce((prevDict, value) => {
  const { name } = value;
  prevDict[name.toUpperCase()] = value.class;
  return prevDict;
}, {});

const ALLOWED_COMMANDS = {
  ENABLED: ['disable'],
  DISABLED: ['enable', 'standby'],
  STANDBY: ['start'],
};

const GlobalState = ({
  summaryState,
  queueState,
  requestSummaryStateCommand,
  commandExecutePermission,
  resumeScriptQueue,
  pauseScriptQueue,
}) => {
  const [contextMenuIsOpen, setContextMenuIsOpen] = React.useState(false);
  const [contextMenuData, setContextMenuData] = React.useState({});

  const onClickContextMenu = React.useCallback((event) => {
    event.stopPropagation();
    setContextMenuIsOpen((state) => !state);
    setContextMenuData(event.target.getBoundingClientRect());
  }, []);

  React.useEffect(() => {
    const handler = () => {
      setContextMenuIsOpen(false);
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const contextMenuOptions = React.useMemo(() => {
    const allowedCommands = ALLOWED_COMMANDS[summaryState.name.toUpperCase()] ?? [];
    return [
      {
        icon: <ResumeIcon />,
        text: 'Start',
        action: () => {
          requestSummaryStateCommand('start');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('start'),
      },
      {
        icon: <ResumeIcon />,
        text: 'Enable',
        action: () => {
          requestSummaryStateCommand('enable');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('enable'),
      },
      {
        icon: <ResumeIcon />,
        text: 'Disable',
        action: () => {
          requestSummaryStateCommand('disable');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('disable'),
      },
      {
        icon: <ResumeIcon />,
        text: 'StandBy',
        action: () => {
          requestSummaryStateCommand('standby');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('standby'),
      },
    ];
  }, [summaryState, requestSummaryStateCommand]);

  return (
    <div className={styles.globalStateWrapper}>
      <div className={styles.globalStateContainer}>
        <div className={styles.title}>STATE</div>
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.stateLabel}>Summary State</span>
            <div className={styles.stateCell}>
              <span className={[summaryStateToStylesMap[summaryState.name], styles.summaryState].join(' ')}>
                {summaryState.name}
              </span>
              {commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={(e) => onClickContextMenu(e, true)}>
                    <div className={styles.pauseIconWrapper} title="Change summaryState">
                      <GearIcon className={styles.gearIcon} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.stateLabel}>Queue State</span>
            <div className={styles.stateCell}>
              <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
              {summaryState.name === "ENABLED" && queueState.name === 'Stopped' && commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={resumeScriptQueue}>
                    <div className={styles.pauseIconWrapper} title="Resume ScriptQueue">
                      <ResumeIcon />
                    </div>
                  </div>
                </>
              )}
              {summaryState.name === "ENABLED" && queueState.name === 'Running' && commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={pauseScriptQueue}>
                    <div className={styles.pauseIconWrapper} title="Pause ScriptQueue">
                      <PauseIcon />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ContextMenu isOpen={contextMenuIsOpen} contextMenuData={contextMenuData} options={contextMenuOptions} />
      </div>
    </div>
  );
};

GlobalState.propTypes = {
  summaryState: PropTypes.shape({
    /** UpperCase name of the summaryState of the scriptqueue
     */
    name: PropTypes.oneOf(['ENABLED', 'DISABLED', 'STANDBY', 'OFFLINE', 'FAULT', 'UNKNOWN']),
  }),
  queueState: PropTypes.shape({
    /**Name to be displayed in the <StatusText/> */
    name: PropTypes.string,
    /** Type of the <StatusText/> */
    statusText: PropTypes.string,
  }),
  /**
   * Callback used to request summaryState changes
   * @param {string} name to be attached to the command as `cmd_<name>`
   */
  requestSummaryStateCommand: PropTypes.func,
  /** If true, then and only then command-related buttons will be shown */
  commandExecutePermission: PropTypes.bool,
  /**
   * Callback used to call the `remote.cmd_resume` command
   * @param {event} onclick event object
   */
  resumeScriptQueue: PropTypes.func,
  /**
   * Callback used to call the `remote.cmd_pause` command
   * @param {event} onclick event object
   */
  pauseScriptQueue: PropTypes.func,
};

export default GlobalState;
