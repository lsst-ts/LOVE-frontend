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

const data = [
  { position: NaN, description: 'asdf', level: 0 },
  { position: 1.5, description: 'asdf', level: 1 },
  { position: 2.2, description: 'asdf', level: 2 },
  { position: 3.213, description: 'asdf', level: 23 },
  { position: 5.23, description: 'asdf', level: 3 },
  { position: 3.23, description: 'asdf', level: 4 },
];

<div style={{ width: '800px' }}>
  <ActionableTable data={data} headers={headers} />
</div>;
```
