```jsx
import { Table, Thead, Tr, Td, Th, Tbody } from './SimpleTable';

const headers = [
  {
    field: 'position',
    label: 'Position',
    type: 'number',
  },
  {
    field: 'description',
    label: 'Descr.',
    type: 'string',
  },
  {
    field: 'level',
    label: 'Severity',
    type: 'number',
  },
];

const data = [
  { position: 1, description: 'asdf', level: 0 },
  { position: 1.5, description: 'asdf', level: 1 },
  { position: 2.2, description: 'asdf', level: 2 },
  { position: 3.213, description: 'asdf', level: 23 },
  { position: 5.23, description: 'asdf', level: 3 },
  { position: 3.23, description: 'asdf', level: 4 },
];

<div
  style={{
    width: '400px',
  }}
>
  <SimpleTable data={data} headers={headers} />
</div>;

// if (col === 'driveStatus') {
//   const driveStatus = value === 'Unknown' || value === '-' ? value : motorDriveStateMap[value];
//   return (
//     <Td key={col} className={styles.statusColumn}>
//       <StatusText small status={stateToStyleMotorDrive[driveStatus]}>
//         {driveStatus}
//       </StatusText>
//     </Td>
//   );
// }
// if (col === 'brakeStatus') {
//   const brakeStatus = value === 'Unknown' || value === '-' ? value : motorBrakeStateMap[value];
//   return (
//     <Td key={col} className={styles.statusColumn}>
//       <StatusText small status={stateToStyleMotorBrake[brakeStatus]}>
//         {brakeStatus}
//       </StatusText>
//     </Td>
//   );
// }
// if (isNaN(value)) {
//   return (
//     <Td isNumber key={col}>
//       {value}
//     </Td>
//   );
// }
// return (
//   <Td isNumber key={col}>
//     {Number.isInteger(value) ? value : Math.round(value * 10000) / 10000}
//   </Td>
// );
```
