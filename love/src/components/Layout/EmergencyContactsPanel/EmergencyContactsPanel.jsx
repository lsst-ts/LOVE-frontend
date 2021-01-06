import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './EmergencyContactsPanel.module.css';
import ManagerInterface, { formatTimestamp } from 'Utils';
import RequeueIcon from 'components/icons/ScriptQueue/RequeueIcon/RequeueIcon';

EmergencyContactsPanel.propTypes = {};

/** Contents of the Config File view Panel, displayed in a modal */
function EmergencyContactsPanel() {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    ManagerInterface.getEmergencyContactList().then((list) => {
      setContactList(list);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Emergency contacts</div>
      <div className={styles.subTitle}>Subtitle</div>
      {contactList.map((contact) => {
        return <div>{JSON.stringify(contact)}</div>;
      })}
    </div>
  );
}
export default memo(EmergencyContactsPanel);
