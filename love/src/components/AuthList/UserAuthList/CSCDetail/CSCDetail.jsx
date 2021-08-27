import React from 'react';
import { SUBICON_OPTIONS, UserAndSubIcon } from '../../../icons/UserAndSubIcon/UserAndSubIcon';
import styles from './CSCDetail.module.css';

export default function CSCDetail({ authlist }) {
  const users = authlist?.authorized_user || [];
  const cscs = authlist?.non_authorized_csc || [];

  return (
    <>
      <div className={styles.title}>AUTHORIZED USERS ({users.length})</div>
      <div className={styles.list}>
        {users.map((user, index) => (
          <div key={index} className={styles.detail}>
            <div className={styles.icon}>
              <UserAndSubIcon key={index + '1'} subIcon={SUBICON_OPTIONS.HAS} />
            </div>
            {user}
          </div>
        ))}
        {users.length === 0 && <div className={styles.detail}>No authorized users</div>}
      </div>

      <div className={styles.title}>UNAUTHORIZED CSCs ({cscs.length}) </div>
      <div className={styles.list}>
        {cscs.map((csc, index) => (
          <div key={index} className={styles.detail}>
            {csc}
          </div>
        ))}
        {cscs.length === 0 && <div className={styles.detail}>No unauthorized CSCs</div>}
      </div>
    </>
  );
}
