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
