/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import PropTypes from 'prop-types';
import { Table, Thead, Tr, Td, Th, Tbody } from './Table';
export { Table, Thead, Tr, Td, Th, Tbody };

/**
 * Renders a table from data and headers configuration
 */
function SimpleTable({ headers, data }) {
  const defaultRenderMethod = (value, row) => value;

  return (
    <Table>
      <Thead>
        <Tr>
          {headers.map((header, index) => (
            <Th key={`header-${index}`} className={header.className}>
              {header.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => {
          return (
            <Tr className={row.rowClass} key={`row-${index}`}>
              {headers.map((header, headerIndex) => {
                const render = header.render || defaultRenderMethod;
                const value = row[header.field];
                return (
                  <Td key={`cell-${headerIndex}`} isNumber={header.type === 'number'} className={header.className}>
                    {render(value, row)}
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
      /** Callback with signature (value,row) => node
       * Use it customize how the cell's value is displayed  */
      render: PropTypes.func,
      /** className to be applied to the whole column */
      className: PropTypes.string,
    }),
  ),
  /** Rows to be rendered in the table */
  data: PropTypes.arrayOf(PropTypes.object),
};

export default SimpleTable;
