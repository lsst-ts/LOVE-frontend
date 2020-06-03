import React from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tr, Td, Th, Tbody } from './Table';
export { Table, Thead, Tr, Td, Th, Tbody };

/**
 * Renders a table from data and headers configuration 
 */
function SimpleTable({ headers, data }) {

  const defaultRenderMethod = (value) => value;

  return (
    <Table>
      <Thead>
        <Tr>
          {headers.map((header, index) => (
            <Th key={`header-${index}`} className={header.className}>{header.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => {
          return (
            <Tr key={index}>
              {headers.map((header, headerIndex) => {
                const render = header.render || defaultRenderMethod;
                const value = row[header.field];
                return (
                  <Td key={headerIndex} isNumber={header.type === 'number'} className={header.className}>
                    {render(value)}
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
  /** Array with properties of table columns and its headers.*/
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      /** Property accessor of this column's value on each data row */
      field: PropTypes.string,
      /** Node to be rendered as header label */
      title: PropTypes.node,
      /** Data type of this column: number, string, ... */
      type: PropTypes.string,
      /** Callback that receives this column's value and should return a `node`. 
       * Use it customize how the cell's value is   */
      render: PropTypes.func,
      /** className to be applied to the whole column */
      className: PropTypes.string
    }),
  ),
  /** Rows to be rendered in the table */
  data: PropTypes.arrayOf(PropTypes.object)
}

export default SimpleTable;