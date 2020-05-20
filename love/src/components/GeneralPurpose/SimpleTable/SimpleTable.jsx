import React from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tr, Td, Th, Tbody } from './Table';
export { Table, Thead, Tr, Td, Th, Tbody };

/**
 * Renders a table from data configuration 
 */
function SimpleTable({ headers, data }) {
  return (
    <Table>
      <Thead>
        <Tr>
          {headers.map((header) => (
            <Th key={header.field}>{header.label}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => {
          return (
            <Tr key={index}>
              {headers.map((header) => {
                const value = row[header.field];
                return (
                  <Td key={header.field} isNumber={header.type === 'number'}>
                    {isNaN(value) || Number.isInteger(value) ? value : `${Math.round(value * 10000) / 10000}º`}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

SimpleTable.propTypes = {
  /** Description of headers and columns content*/
  headers: PropTypes.shape({
    /** Property accessor of this column's value on each data row */
    field: PropTypes.string,
    /** Node to be rendered as header label */
    label: PropTypes.node,
    /** Data type of this column: number, string, ... */
    type: PropTypes.string
  }),
  /** Rows to be rendered in the table */
  data: PropTypes.arrayOf(PropTypes.object)
}

export default SimpleTable;