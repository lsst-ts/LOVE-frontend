Basic example.

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
      return (
        <StatusText status={status}>
          {status}-{value}
        </StatusText>
      );
    },
    sort: (value1, value2, sortingFactor, row1, row2) => {
      const status1 = !!labelsDict[value1] ? labelsDict[value1] : 'invalid';
      const status2 = !!labelsDict[value2] ? labelsDict[value2] : 'invalid';
      
      if (status1 > status2) {
        return 1 * sortingFactor;
      }
      if (status1 < status2) {
        return -1 * sortingFactor;
      }
      return 0;
    },
    filter: (filterString, value, row) => {
      /** Test against the label {status}-{value}, not just the value **/
      try {
        const regexp =
          filterString === '' || filterString === undefined ? new RegExp('(?:)') : new RegExp(filterString, 'i');

        const status = !!labelsDict[value] ? labelsDict[value] : 'invalid';
        return regexp.test(`${status}-${value}`);
      } catch (e) {
        console.warn('Invalid filter value in regexp', value);
      }
      return true;
    },
    ascendingSortLabel: 'Less critical first',
    descendingSortLabel: 'More critical first',
  },
];

const data = new Array(1).fill(1).flatMap(() => [
  { position: NaN, description: 'asdf', level: 0 },
  { position: 1.5, description: 'bsdf', level: 1 },
  { position: 2.2, description: 'csdf', level: 2 },
  { position: 3.213, description: 'dsdf', level: 23 },
  { position: 5.23, description: 'esdf', level: 3 },
  { position: 3.23, description: 'fsdf', level: 4 },
]);

<div style={{ width: '800px', background: 'black' }}>
  <ActionableTable data={data} headers={headers} />
</div>;
```
