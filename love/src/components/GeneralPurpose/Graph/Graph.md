asdfafds

```jsx
const nodes = [
  { id: 'node1', label: 'This is node 1', position: { x: 100, y: 200 } },
  { id: 'node2', label: 'This is node 2', position: { x: 250, y: 100 } },
  { id: 'node3', label: 'This is node 3', position: { x: 400, y: 100 } },
  { id: 'node4', label: 'This is node 4', position: { x: 200, y: 0 } },
  { id: 'node5', label: 'This is node 5', position: { x: 400, y: 300 } },
];

const links = [
  { id: 'link1', source: { id: 'node1', port: 'right3' }, target: { id: 'node2', port: 'bottom3' }, color: 'white', selectedColor: 'red' },
  { id: 'link2', source: { id: 'node3', port: 'left1' }, target: { id: 'node2', port: 'right2' } },
  { id: 'link3', source: { id: 'node4', port: 'bottom3' }, target: { id: 'node2', port: 'top3' } },
  { id: 'link4', source: { id: 'node5', port: 'top1' }, target: { id: 'node2', port: 'bottom1' } },
];

<div
  style={{
    background: 'black',
  }}
>
  <Graph nodes={nodes} links={links} />
</div>;
```
