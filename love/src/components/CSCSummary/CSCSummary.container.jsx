/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import CSCSummary from './CSCSummary';
import { CSCSummaryHierarchy } from '../../Config';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary of all CSCs, including heartbeats, summary state, logs and error codes',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC summary',
    },
    hierarchy: {
      type: 'object',
      description: 'Hierarchy on which to display CSC summaries',
      isPrivate: false,
      default: CSCSummaryHierarchy,
    },
  },
};

const CSCSummaryContainer = ({ hierarchy = CSCSummaryHierarchy, expandHeight, ...props }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const subscribeToStreamCallback = (cscName, index) => {
    const groups = [
      `event-${cscName}-${index}-summaryState`,
      `event-${cscName}-${index}-logMessage`,
      `event-${cscName}-${index}-errorCode`,
    ];
    setSubscriptions((prevSubscriptions) => [...prevSubscriptions, ...groups]);
  };
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <CSCSummary
      hierarchy={hierarchy}
      expandHeight={expandHeight}
      subscribeToStreamCallback={subscribeToStreamCallback}
    />
  );
};

export default CSCSummaryContainer;
