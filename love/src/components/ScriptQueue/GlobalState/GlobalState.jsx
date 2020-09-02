import React from 'react';
import styles from './GlobalState.module.css';
import scriptStyles from '../Scripts/Scripts.module.css';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import ContextMenu from '../Scripts/ContextMenu/ContextMenu';

const ALLOWED_COMMANDS = {
  ENABLED: ['disable'],
  DISABLED: ['enable', 'standby'],
  STANDBY: ['start'],
};

const GlobalState = ({ summaryState, queueState }) => {
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
    document.body.addEventListener('click', handler);
    return () => {
      document.body.removeEventListener('click', handler);
    };
  }, []);

  const allowedCommands = ALLOWED_COMMANDS[summaryState.name.toUpperCase()] ?? [];

  const contextMenuOptions = [
    {
      icon: <ResumeIcon/>,
      text: 'Start',
      action: () => console.log('asdf'),
      disabled: !allowedCommands.includes('start'),
    },
    {
      icon: <ResumeIcon/>,
      text: 'Enable',
      action: () => console.log('asd'),
      disabled: !allowedCommands.includes('enable'),
    },
    {
      icon: <ResumeIcon/>,
      text: 'Disable',
      action: () => console.log('asdf'),
      disabled: !allowedCommands.includes('disable'),
    },
  ];

  return (
    <div className={styles.globalStateWrapper}>
      <div className={styles.globalStateControls}>
        <div
          className={[scriptStyles.buttonContainer, scriptStyles.noBackgroundButton].join(' ')}
          onClick={(e) => onClickContextMenu(e, true)}
        >
          <span className={styles.threeDotsButton}>&#8943;</span>
        </div>
      </div>
      <div className={styles.globalStateContainer}>
        <div className={styles.stateContainer}>
          Summary State
          <StatusText status={summaryState.statusText}>{summaryState.name}</StatusText>
        </div>
        <div className={styles.stateContainer}>
          Queue state
          <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
        </div>
      </div>
      <ContextMenu isOpen={contextMenuIsOpen} contextMenuData={contextMenuData} options={contextMenuOptions} />
    </div>
  );
};

export default GlobalState;
