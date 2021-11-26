import React from 'react';
import styles from './UserAuthList.module.css';
import CSCRealm from './CSCRealm/CSCRealm';

export default function UserAuthList({ authlist, hierarchy, username, authlistRequests, reloadData }) {
  return (
    <div className={styles.CSCAuthListContainer}>
      <div className={styles.header}>AuthList - USER: {username}</div>
      <div className={styles.CSCRealmsContainer}>
        {Object.keys(hierarchy).map((realm) => {
          return (
            <div key={realm} className={styles.CSCRealmContainer}>
              <CSCRealm
                username={username}
                name={realm}
                groups={hierarchy[realm]}
                authlist={authlist}
                authlistRequests={authlistRequests}
                reloadData={reloadData}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
