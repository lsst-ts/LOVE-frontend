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

import React, { Component } from 'react';
import ManagerInterface from '../../../Utils';
import SimpleTable from '../../GeneralPurpose/SimpleTable/SimpleTable';

export default class XMLTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
  }
  componentDidMount() {
    ManagerInterface.getXMLMetadata().then((data) => {
      this.setState({ data });
    });
  }

  render() {
    const headers = [
      {
        field: 'name',
        title: 'Name',
      },
      {
        field: 'sal_version',
        title: 'SAL version',
      },
      {
        field: 'xml_version',
        title: 'XML version (LOVE)',
      },
      {
        field: 'xml_version_reported',
        title: 'XML version (reported)',
      },
    ];

    if (!this.state.data) {
      return <span>Loading...</span>;
    }

    const data = this.state.data
      ? Object.entries(this.state.data).map(([key, data]) => {
          return {
            ...data,
            name: key,
          };
        })
      : [];

    return <SimpleTable headers={headers} data={data} />;
  }
}
