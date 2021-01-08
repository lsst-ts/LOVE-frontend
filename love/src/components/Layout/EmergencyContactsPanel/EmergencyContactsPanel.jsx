import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Select from 'components/GeneralPurpose/Select/Select';
import styles from './EmergencyContactsPanel.module.css';
import ManagerInterface, { formatTimestamp } from 'Utils';
import RequeueIcon from 'components/icons/ScriptQueue/RequeueIcon/RequeueIcon';
import Input from 'components/GeneralPurpose/Input/Input';

EmergencyContactsPanel.propTypes = {};

/** Contents of the Config File view Panel, displayed in a modal */
function EmergencyContactsPanel() {
  const [contactList, setContactList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [filterString, setFilterString] = useState('');
  useEffect(() => {
    ManagerInterface.getEmergencyContactList().then((list) => {
      setContactList(list);
    });
  }, []);

  const ECCard = (ECData) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.subsystem}>{ECData?.subsystem}</div>
        <div className={[styles.contactItem, styles.highlighted].join(' ')}>{ECData?.name}</div>
        <div className={styles.contactItem}>
          <span>Contact info: </span>
          <span>{ECData?.contact_info}</span>
        </div>
        <div className={styles.contactItem}>
          <span>Email: </span>
          <span>{ECData?.email}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Emergency contacts</div>
      <div className={styles.filterContainer}>
        <span className={styles.subTitle}>Filter:</span>
        <Input onChange={(e) => setFilterString(e.target.value)} className={styles.availableScriptsInput} />
      </div>
      {contactList
        .filter((contact) => {
          const lowerCaseFilter = filterString?.toLowerCase();
          return (
            filterString === '' ||
            (contact?.subsystem?.toLowerCase() ?? '').includes(lowerCaseFilter) ||
            (contact?.name?.toLowerCase() ?? '').includes(lowerCaseFilter) ||
            (contact?.contact_info?.toLowerCase() ?? '').includes(lowerCaseFilter) ||
            (contact?.email?.toLowerCase() ?? '').includes(lowerCaseFilter)
          );
        })
        .map((contact) => {
          return ECCard(contact);
        })}
    </div>
  );
}
export default memo(EmergencyContactsPanel);
