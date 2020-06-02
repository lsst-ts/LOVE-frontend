Basic example with with a column with custom styles.

```jsx
const headers = [
  {
    field: 'position',
    title: 'Position',
    type: 'number',
    subtitle: 'subtitle1',
    render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
  },
  {
    field: 'description',
    title: 'Descr.',
    type: 'string',
    subtitle: 'subtitle2',
  },
  {
    field: 'level',
    title: 'Severity',
    type: 'number',
    subtitle: 'subtitle3',
  },
];

const data = new Array(100).fill(1).flatMap(() => [
  { position: NaN, description: 'asdf', level: 0 },
  { position: 1.5, description: 'asdf', level: 1 },
  { position: 2.2, description: 'asdf', level: 2 },
  { position: 3.213, description: 'asdf', level: 23 },
  { position: 5.23, description: 'asdf', level: 3 },
  { position: 3.23, description: 'asdf', level: 4 },
]);

<div style={{ width: '800px', background: 'black' }}>
  <ActionableTable data={data} headers={headers} />
</div>;
```

Custom sorting function

```jsx
import StatusText from '../StatusText/StatusText';

const labelsDict = {
  0: 'ok',
  2: 'running',
  3: 'warning',
  4: 'critical',
};

const headers = [
  {
    field: 'position',
    title: 'Position',
    type: 'number',
    render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
  },
  {
    field: 'description',
    title: 'Descr.',
    type: 'string',
  },
  {
    field: 'level',
    title: 'Severity',
    type: 'number',
    render: (value) => {
      const status = !!labelsDict[value] ? labelsDict[value] : 'invalid';
      return <StatusText status={status}>{status}-{value}</StatusText>;
    },
    sort: (row1, row2, sortingColumn, sortingDirection) => {
      const v1 = row1[sortingColumn];
      const v2 = row2[sortingColumn];
      const status1 = !!labelsDict[v1] ? labelsDict[v1] : 'invalid';
      const status2 = !!labelsDict[v2] ? labelsDict[v2] : 'invalid';

      const sortingFactor = sortingDirection === 'ascending' ? 1 : -1;
      console.log('sortingFactor, status1, status2', sortingFactor, status1, status2);

      if (status1 > status2) {
        return 1 * sortingFactor;
      }
      if (status1 < status2) {
        return -1 * sortingFactor;
      }
      return 0;
    },
  },
];

const data = new Array(100).fill(1).flatMap(() => [
  { position: NaN, description: 'asdf', level: 0 },
  { position: 1.5, description: 'asdf', level: 1 },
  { position: 2.2, description: 'asdf', level: 2 },
  { position: 3.213, description: 'asdf', level: 23 },
  { position: 5.23, description: 'asdf', level: 3 },
  { position: 3.23, description: 'asdf', level: 4 },
]);

<div style={{ width: '800px', background: 'black' }}>
  <ActionableTable data={data} headers={headers} />
</div>;
```
