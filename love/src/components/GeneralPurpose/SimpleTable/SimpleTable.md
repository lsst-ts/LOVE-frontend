Basic example with with a column with custom styles.

```jsx
import styles from './examplestyle.module.css';
import SimpleTable from './SimpleTable';

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
    className: styles.exampleClass,
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

<div style={{ width: '400px' }}>
  <SimpleTable data={data} headers={headers} />
</div>;
```
