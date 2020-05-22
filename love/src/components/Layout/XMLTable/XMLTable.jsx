import React, { Component } from 'react';
import ManagerInterface from '../../../Utils';
import SimpleTable, { Table, Thead, Tbody, Td, Tr, Th } from '../../GeneralPurpose/SimpleTable/SimpleTable';
import styles from './XMLTable.module.css';

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
        label: 'Name'
      },
      {
        field: 'sal_version',
        label: 'SAL version',
      },
      {
        field: 'xml_version',
        label: 'XML version (LOVE)'
      },
      {
        field: 'xml_version_reported',
        label: 'XML version (reported)'
      }
    ];

    if (!this.state.data) {
      return <span>Loading...</span>;
    }

    const data = this.state.data ? Object.entries(this.state.data).map(([key, data]) => {

      return {
        ...data,
        name: key
      }
    }) : [];


    return <SimpleTable headers={headers} data={data} />

  }
}
