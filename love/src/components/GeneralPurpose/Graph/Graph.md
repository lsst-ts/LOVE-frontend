asdfafds 

```jsx
import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import * as React from 'react';

import { CanvasWidget } from '@projectstorm/react-canvas-core';
//1) setup the diagram engine
var engine = createEngine();

//2) setup the diagram model
var model = new DiagramModel();

//3-A) create a default node
var node1 = new DefaultNodeModel({
    name: 'Node 1',
    color: 'rgb(0,192,255)'
});
node1.setPosition(0, 0);
let port1 = node1.addOutPort('Out');

//3-B) create another default node
var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
let port2 = node2.addInPort('In');
node2.setPosition(10, 10);

// link the ports
let link1 = port1.link(port2);
link1.getOptions().testName = 'Test';
link1.addLabel('Hello World!');

//4) add the models to the root graph
model.addAll(node1, node2, link1);

//5) load model into engine
engine.setModel(model);

//6) render the diagram!

<div style={{
    display:'flex',
    height:'400px',
    width:'800px',
    background: 'gray'
}}>
    <CanvasWidget engine={engine} />
</div>
```