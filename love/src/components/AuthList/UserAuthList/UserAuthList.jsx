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
