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

import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import Button from 'components/GeneralPurpose/Button/Button';
import Exposure from './Exposure/Exposure';
import NonExposure from './NonExposure/NonExposure';
import ExposureAdd from './Exposure/ExposureAdd';
import NonExposureEdit from './NonExposure/NonExposureEdit';
import { OLE_COMMENT_TYPE_OPTIONS, OLE_DEFAULT_SYSTEMS_FILTER_OPTION, iconLevelOLE } from 'Config';
import ManagerInterface from 'Utils';
import styles from './OLE.module.css';

const tabs = [
  { name: 'Narrative Logs', value: 'non-exposure' },
  { name: 'Exposure Logs', value: 'exposure' },
];

export function getIconLevel(level) {
  const icon = iconLevelOLE[level >= 100 ? 'urgent' : 'info'];
  return icon;
}

export function closeCalendar(ref) {
  const buttons = ref?.querySelectorAll('button');
  const clickEvent = new Event('click', { bubbles: true });
  if (buttons && buttons.length > 0) {
    // buttons[2] is the button to close the calendar
    // hidden by default so it can only be clicked programatically
    buttons[2].dispatchEvent(clickEvent);
  }
}

function OLE({ taiToUtc }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].value);
  const [clickNewLog, setClickNewLog] = useState(false);

  const now = Moment();
  const oneDayAgo = Moment().subtract(1, 'days');
  const [selectedDayNarrativeStart, setSelectedDayNarrativeStart] = useState(oneDayAgo);
  const [selectedDayExposureStart, setSelectedDayExposureStart] = useState(oneDayAgo);
  const [selectedDayNarrativeEnd, setSelectedDayNarrativeEnd] = useState(now);
  const [selectedDayExposureEnd, setSelectedDayExposureEnd] = useState(now);

  const [selectedCommentType, setSelectedCommentType] = useState(OLE_COMMENT_TYPE_OPTIONS[0]);
  const [selectedSystem, setSelectedSystem] = useState(OLE_DEFAULT_SYSTEMS_FILTER_OPTION);
  const [selectedObsTimeLoss, setSelectedObsTimeLoss] = useState(false);
  const [selectedJiraTickets, setSelectedJiraTickets] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  const [selectedExposureType, setSelectedExposureType] = useState('all');
  const [registryMap, setRegistryMap] = useState({});

  useEffect(() => {
    ManagerInterface.getListExposureInstruments().then((data) => {
      const registryMap = {};
      Object.entries(data).forEach(([key, value]) => {
        value.forEach((instrument) => {
          if (!instrument) return;
          registryMap[instrument] = key;
        });
      });
      const instrumentsArray = Object.keys(registryMap);
      setInstruments(instrumentsArray);
      setSelectedInstrument(instrumentsArray[0]);
      setRegistryMap(registryMap);
    });
  }, []);

  const handleDayExposureChange = (day, type) => {
    if (type === 'start') setSelectedDayExposureStart(day);
    if (type === 'end') setSelectedDayExposureEnd(day);
  };

  const handleDayNarrativeChange = (day, type) => {
    if (type === 'start') setSelectedDayNarrativeStart(day);
    if (type === 'end') setSelectedDayNarrativeEnd(day);
  };

  const getComponent = (isNewLog, tab) => {
    if (isNewLog) {
      if (tab === 'exposure') {
        return <ExposureAdd isLogCreate={true} back={() => setClickNewLog(false)} taiToUtc={taiToUtc} />;
      }
      if (tab === 'non-exposure') {
        return <NonExposureEdit isLogCreate={true} back={() => setClickNewLog(false)} taiToUtc={taiToUtc} />;
      }
    }

    if (tab === 'exposure') {
      return (
        <Exposure
          instruments={instruments}
          selectedInstrument={selectedInstrument}
          changeInstrumentSelect={setSelectedInstrument}
          selectedExposureType={selectedExposureType}
          changeExposureTypeSelect={setSelectedExposureType}
          selectedDayExposureStart={selectedDayExposureStart}
          selectedDayExposureEnd={selectedDayExposureEnd}
          changeDayExposure={handleDayExposureChange}
          registryMap={registryMap}
          taiToUtc={taiToUtc}
        />
      );
    }
    if (tab === 'non-exposure') {
      return (
        <NonExposure
          selectedDayNarrativeStart={selectedDayNarrativeStart}
          selectedDayNarrativeEnd={selectedDayNarrativeEnd}
          changeDayNarrative={handleDayNarrativeChange}
          selectedCommentType={selectedCommentType}
          changeCommentTypeSelect={setSelectedCommentType}
          selectedSystem={selectedSystem}
          changeSystemSelect={setSelectedSystem}
          selectedObsTimeLoss={selectedObsTimeLoss}
          changeObsTimeLossSelect={setSelectedObsTimeLoss}
          selectedJiraTickets={selectedJiraTickets}
          changeJiraTicketsSelect={setSelectedJiraTickets}
          taiToUtc={taiToUtc}
        />
      );
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
      <div className={styles.tabsRow}>
        {html}
        <div className={styles.btnNew}>
          <Button className={styles.btn} onClick={() => setClickNewLog(true)}>
            + New {tabs.filter((tab) => tab.value === selectedTab)[0].name.slice(0, -1)}
          </Button>
        </div>
      </div>
      <div className={styles.tableWrapper}>{getComponent(clickNewLog, selectedTab)}</div>
    </div>
  );
}

export default OLE;
