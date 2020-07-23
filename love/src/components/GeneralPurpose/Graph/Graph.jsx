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


export default ({ nodes, links }) => {

  const engine = React.useMemo(() => {
    //1) setup the diagram engine
    const engine = createEngine();

    // register some other factories as well
    engine
      .getPortFactories()
      .registerFactory(new SimplePortFactory('diamond', (config) => new DiamondPortModel(PortModelAlignment.LEFT)));
    engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

    //2) setup the diagram model
    const model = new DiagramModel();

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
    model.setLocked(true);

    //5) load model into engine
    engine.setModel(model);

    return engine;
  }, [nodes, links]);

  //6) render the diagram!
  return (
    <div className={styles.container}>
      <CanvasWidget engine={engine} />
    </div>
  );
};
