```jsx

const headers = [
  {
    field: 'position',
    title: 'Position',
    type: 'number',
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
  },
];

const data =  new Array(100).fill(1).flatMap(() => ([
  { position: NaN, description: 'asdf', level: 0 },
  { position: 1.5, description: 'asdf', level: 1 },
  { position: 2.2, description: 'asdf', level: 2 },
  { position: 3.213, description: 'asdf', level: 23 },
  { position: 5.23, description: 'asdf', level: 3 },
  { position: 3.23, description: 'asdf', level: 4 },
]));

<div style={{ width: '400px' }}>
  <PaginatedTable data={data} headers={headers} />
</div>;
```
