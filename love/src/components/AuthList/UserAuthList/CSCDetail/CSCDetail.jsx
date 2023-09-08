/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
