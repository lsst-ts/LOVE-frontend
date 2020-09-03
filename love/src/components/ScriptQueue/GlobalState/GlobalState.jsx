import React from 'react';
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

  const onClickContextMenu = (event) => {
    event.stopPropagation();
    setContextMenuIsOpen((state) => !state);
    setContextMenuData(event.target.getBoundingClientRect());
  };

  React.useEffect(() => {
    const handler = () => {
      setContextMenuIsOpen(false);
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const allowedCommands = ALLOWED_COMMANDS[summaryState.name.toUpperCase()] ?? [];

  const contextMenuOptions = [
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
              {queueState.name === 'Stopped' && commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={resumeScriptQueue}>
                    <div className={styles.pauseIconWrapper} title="Resume ScriptQueue">
                      <ResumeIcon />
                    </div>
                  </div>
                </>
              )}
              {queueState.name === 'Running' && commandExecutePermission && (
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
      {/* <div className={styles.globalStateControls}>
        <div
          className={[scriptStyles.buttonContainer, scriptStyles.noBackgroundButton].join(' ')}
          onClick={(e) => onClickContextMenu(e, true)}
        >
          <span className={styles.threeDotsButton}>&#8943;</span>
        </div>
      </div>
      <div className={styles.globalStateContainer}>
        <div className={styles.stateContainer}>
          <span className={styles.stateLabel}>Summary State</span>
          <span className={[summaryStateToStylesMap[summaryState.name], styles.summaryState].join(' ')}>{summaryState.name}</span>
        </div>
        <div className={styles.stateContainer}>
          <span className={styles.stateLabel}>Queue State</span>
          <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
        </div>
      </div>
      <ContextMenu isOpen={contextMenuIsOpen} contextMenuData={contextMenuData} options={contextMenuOptions} /> */}
    </div>
  );
};

export default GlobalState;
