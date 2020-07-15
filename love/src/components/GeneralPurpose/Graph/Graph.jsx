import React from 'react';
import createEngine, {
  DefaultNodeModel,
  DefaultPortModel,
  DiagramModel,
  PortModelAlignment,
} from '@projectstorm/react-diagrams';
// import the custom models
import { DiamondNodeModel } from './Node//DiamondNodeModel';
import { DiamondNodeFactory } from './Node/DiamondNodeFactory';
import { DiamondPortModel } from './Node/DiamondPortModel';
import { SimplePortFactory } from './Node/SimplePortFactory';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styles from './Graph.module.css';

const nodes = [
  { id: 'node1', label: 'This is node 1', position: { x: 100, y: 200 } },
  { id: 'node2', label: 'This is node 2', position: { x: 250, y: 100 } },
  { id: 'node3', label: 'This is node 3', position: { x: 400, y: 100 } },
  { id: 'node4', label: 'This is node 4', position: { x: 200, y: 0 } },
  { id: 'node5', label: 'This is node 5', position: { x: 400, y: 300 } },
];

const links = [
  { id: 'link1', source: { id: 'node1', port: 'top' }, target: { id: 'node2', port: 'left' } },
  { id: 'link2', source: { id: 'node3', port: 'top' }, target: { id: 'node2', port: 'right' } },
  { id: 'link3', source: { id: 'node4', port: 'top' }, target: { id: 'node2', port: 'right' } },
  { id: 'link4', source: { id: 'node5', port: 'top' }, target: { id: 'node2', port: 'right' } },
];
export default () => {
  //1) setup the diagram engine
  var engine = createEngine();

  // register some other factories as well
  engine
    .getPortFactories()
    .registerFactory(new SimplePortFactory('diamond', (config) => new DiamondPortModel(PortModelAlignment.LEFT)));
  engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

  //2) setup the diagram model
  var model = new DiagramModel();

  const nodeModels = nodes.reduce((prevDict, node) => {
    const nodeModel = new DiamondNodeModel(node.label);
    nodeModel.setPosition(node.position.x, node.position.y);

    prevDict[node.id] = nodeModel;
    return prevDict;
  }, {});

  const linkModels = links.reduce((prevDict, link) => {
    const source = nodeModels[link.source.id];
    const sourcePort = source.getPort(PortModelAlignment[link.source.port.toUpperCase()]);

    const target = nodeModels[link.target.id];
    const targetPort = target.getPort(PortModelAlignment[link.target.port.toUpperCase()]);

    prevDict[link.id] = sourcePort.link(targetPort);
    return prevDict;
  }, {});

  model.addAll(...Object.values(nodeModels), ...Object.values(linkModels));

  // //3-A) create a default node
  // var node1 = new DiamondNodeModel('This is node 1');
  // var port1 = node1.getPort(PortModelAlignment.TOP);
  // node1.setPosition(100, 200);

  // //3-B) create our new custom node
  // var node2 = new DiamondNodeModel('This is node 2');
  // node2.setPosition(250, 108);

  // var node3 = new DefaultNodeModel('Node 3', 'red');
  // var port3 = node3.addInPort('In');
  // node3.setPosition(400, 100);

  // //3-C) link the 2 nodes together
  // var link1 = port1.link(node2.getPort(PortModelAlignment.LEFT));
  // var link2 = port3.link(node2.getPort(PortModelAlignment.RIGHT));

  // var node4 = new DefaultNodeModel('Node 4', 'rgb(0,192,255)');
  // var port4 = node4.addOutPort('Out');
  // node4.setPosition(200, 10);

  // var link3 = port4.link(node2.getPort(PortModelAlignment.TOP));

  // var node5 = new DefaultNodeModel('Node 5', 'mediumpurple');
  // var port5 = node5.addInPort('In');
  // node5.setPosition(400, 300);

  // var link4 = port5.link(node2.getPort(PortModelAlignment.BOTTOM));

  //4) add the models to the root graph
  // model.addAll(node1, node2, node3, link1, link2, node4, link3, link4, node5);
  model.setLocked(true);

  //5) load model into engine
  engine.setModel(model);

  //6) render the diagram!
  return (
    <div className={styles.container}>
      <CanvasWidget engine={engine} />
    </div>
  );
};
