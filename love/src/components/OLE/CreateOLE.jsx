/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState } from 'react';
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import JiraTicketAdd from './NonExposure/JiraTicketAdd';
import styles from './OLE.module.css';

const tabs = [
  { name: 'Narrative Logs', value: 'non-exposure' },
  { name: 'Exposure Logs', value: 'exposure' },
  { name: 'Jira Tickets', value: 'jira-tickets' },
];

function CreateOLE() {
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const getComponent = (tab) => {
    if (tab === 'exposure') {
      return <ExposureAdd isLogCreate={true} />;
    } else if (tab === 'non-exposure') {
      return <NonExposureEdit isLogCreate={true} />;
    } else if (tab === 'jira-tickets') {
      return <JiraTicketAdd />;
    }
  };

  const html = tabs.map((item, index) => {
    return (
      <div
        className={[styles.tab, selectedTab === item.value ? styles.selected : ''].join(' ')}
        key={index}
        onClick={() => setSelectedTab(item.value)}
      >
        <div className={styles.tabLabel}>{item.name}</div>
      </div>
    );
  });

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsRow}>{html}</div>
      <div className={styles.tableWrapper}>{getComponent(selectedTab)}</div>
    </div>
  );
}

export default CreateOLE;
