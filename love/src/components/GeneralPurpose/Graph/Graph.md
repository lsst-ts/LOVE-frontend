asdfafds

```jsx
const nodes = [
  { id: 'node1', label: 'This is node 1', position: { x: 50, y: 200 } },
  { id: 'node2', label: 'This is node 2', position: { x: 500, y: 0 } },
  { id: 'node3', label: 'This is node 3', position: { x: 500, y: 200 } },
  { id: 'node4', label: 'This is node 4', position: { x: 500, y: 400 } },
];

const links = [
  {
    id: 'link1',
    source: { id: 'node1', port: 'right3' },
    target: { id: 'node2', port: 'left1' },
    color: 'white',
    width: 2,
    tooltip: 'link1'
  },
  {
    id: 'link2',
    source: { id: 'node1', port: 'right2' },
    target: { id: 'node3', port: 'left2' },
    tooltip: 'link2'
  },
  {
    id: 'link3',
    source: { id: 'node1', port: 'right1' },
    target: { id: 'node4', port: 'left3' },
    tooltip: 'link3'
  },
];

<div
  style={{
    background: 'black',
  }}
>
  <Graph nodes={nodes} links={links} width={800} />
</div>;
```
