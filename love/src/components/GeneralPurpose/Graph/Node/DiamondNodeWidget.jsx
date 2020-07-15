import * as React from 'react';
import {  PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styles from './DiamondNodeWidget.module.css';


const Port = ({ children }) => {
  return <div className={styles.port}>{children}</div>;
};

/**
 * @author Dylan Vorster
 */
export class DiamondNodeWidget extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'relative',
          width: this.props.size,
          height: this.props.size,
          display: 'flex',
        }}
      >
        <span className={[styles.node, this.props.node.isSelected() ? styles.selected : ''].join(' ')}>
          {this.props.node.label}
        </span>

        <PortWidget
          style={{
            top: this.props.size / 2 - 8,
            left: -8,
            position: 'absolute',
            visibility: 'hidden',
          }}
          port={this.props.node.getPort(PortModelAlignment.LEFT)}
          engine={this.props.engine}
        >
          <Port />
        </PortWidget>
        <PortWidget
          style={{
            left: this.props.size / 2 - 8,
            top: -8,
            position: 'absolute',
            visibility: 'hidden',
          }}
          port={this.props.node.getPort(PortModelAlignment.TOP)}
          engine={this.props.engine}
        >
          <Port />
        </PortWidget>
        <PortWidget
          style={{
            left: this.props.size - 8,
            top: this.props.size / 2 - 8,
            position: 'absolute',
            visibility: 'hidden',
          }}
          port={this.props.node.getPort(PortModelAlignment.RIGHT)}
          engine={this.props.engine}
        >
          <Port />
        </PortWidget>
        <PortWidget
          style={{
            left: this.props.size / 2 - 8,
            top: this.props.size - 8,
            position: 'absolute',
            visibility: 'hidden',
          }}
          port={this.props.node.getPort(PortModelAlignment.BOTTOM)}
          engine={this.props.engine}
        >
          <Port />
        </PortWidget>
      </div>
    );
  }
}
