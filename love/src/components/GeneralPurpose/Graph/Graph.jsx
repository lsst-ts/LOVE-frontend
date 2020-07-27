import React from 'react';
import PropTypes from 'prop-types';
import createEngine, {
  DefaultNodeModel,
  DefaultPortModel,
  DiagramModel
} from '@projectstorm/react-diagrams';
// import the custom models
import { DiamondNodeModel } from './entities/node/DiamondNodeModel';
import { DiamondNodeFactory } from './entities/node/DiamondNodeFactory';
import { DiamondPortModel, PortModelAlignment } from './entities/port/DiamondPortModel';
import { SimplePortFactory } from './entities/port/SimplePortFactory';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styles from './Graph.module.css';
import { EditableLabelModel } from './entities/label/EditableLabelModel';
import { EditableLabelFactory } from './entities/label/EditableLabelFactory';

const Graph = ({ nodes, links, width = 500, height = 500 }) => {

  const engine = React.useMemo(() => {
    //1) setup the diagram engine
    const engine = createEngine();

    // register some other factories as well
    engine.getPortFactories()
      .registerFactory(new SimplePortFactory('diamond', (config) => new DiamondPortModel(PortModelAlignment.LEFT)));
    engine.getNodeFactories().registerFactory(new DiamondNodeFactory());
    engine.getLabelFactories().registerFactory(new EditableLabelFactory());

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

      const linkObject = sourcePort.link(targetPort, link.color, link.width);
      linkObject.addLabel(
        new EditableLabelModel({
          value: link.tooltip
        })
      );
      prevDict[link.id] = linkObject;

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
    <div className={styles.container} style={{ width, height }}>
      <CanvasWidget engine={engine} />
    </div>
  );
};


Graph.propTypes = {
  /** Width of the diagram canvas, defaults to 500px */
  width: PropTypes.number,
  /** Height of the diagram canvas, defaults to 500px */
  height: PropTypes.number,
  /** Array describing the nodes of the graph */
  nodes: PropTypes.arrayOf(PropTypes.shape({
    /** Unique identifier of a node */
    id: PropTypes.string.isRequired,
    /** Text or node to be shown inside each node box */
    label: PropTypes.node,
    /** Position of the top left corner of the node HTML element in the conainer*/
    position: PropTypes.shape({
      /** x coordinate (increasing from the left)*/
      x: PropTypes.number.isRequired,
      /** y coordinate (increasing from the top of the container) */
      y: PropTypes.number.isRequired,
    }).isRequired
  })).isRequired,

  /** Array describing the links (i.e., connectors, edges, etc) of the graph */
  links: PropTypes.arrayOf(PropTypes.shape({
    /** Unique identifier of the link */
    id: PropTypes.string.isRequired,
    /** Source point of the link */
    source: PropTypes.shape({
      /** Node that the link is attached to */
      id: PropTypes.string.isRequired,
      /** Node's port to which it is attached */
      port: PropTypes.string.isRequired
    }).isRequired,
    /** End point of the link */
    target: PropTypes.shape({
      /** Node that the link is attached to */
      id: PropTypes.string.isRequired,
      /** Node's port to which it is attached (TODO: make a list of available ports)*/
      port: PropTypes.string.isRequired
    }).isRequired,
    /** Color of the line, defaults to grey */
    color: PropTypes.string,
    /** Tooltip to be displayed in the middle of the line */
    tooltip: PropTypes.node
  })).isRequired
}

export default Graph;