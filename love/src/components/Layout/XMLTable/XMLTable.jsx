import React, { Component } from 'react';
import ManagerInterface from '../../../Utils';
import { Table, Thead, Tbody, Td, Tr, Th } from '../../GeneralPurpose/SimpleTable/SimpleTable';
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
    return this.state.data ? (
      <Table className={styles.table}>
        <Thead>
          <Tr className={styles.headerRow}>
            <Th>Name</Th>
            <Th>SAL version</Th>
            <Th>XML version (LOVE)</Th>
            <Th>XML version (reported)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(this.state.data).map((key) => {
            const csc = this.state.data[key];
            return (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td isNumber>{csc?.['sal_version'] ?? 'Unkonwn'}</Td>
                <Td isNumber>{csc?.['xml_version'] ?? 'Unkonwn'}</Td>
                <Td isNumber>-</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    ) : (
      <span>Loading...</span>
    );
  }
}
