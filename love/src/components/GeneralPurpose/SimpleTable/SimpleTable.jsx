import React from 'react';
import { Table, Thead, Tr, Td, Th, Tbody } from './Table';
export { Table, Thead, Tr, Td, Th, Tbody };

export default function SimpleTable({ headers, data }) {

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