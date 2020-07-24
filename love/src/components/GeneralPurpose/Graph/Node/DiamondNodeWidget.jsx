import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import styles from './DiamondNodeWidget.module.css';
import { PortModelAlignment } from './DiamondPortModel';

const Port = ({ children }) => {
  return <div className={styles.port}>{children}</div>;
};

const StyledPortWidget = ({ left, top, port, engine }) => {
  return (<PortWidget
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      // visibility: 'hidden',
      left,
      top
    }}
    port={port}
    engine={engine}
  >
    <Port />
  </PortWidget>)
}

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



        {
          new Array(3).fill('TOP').map((location, index) => {
            return (
              <StyledPortWidget
                key={index}
                left={this.props.size * (0.5 - (index - 1) * 0.2)}
                top={-2}
                port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
                engine={this.props.engine} />
            )
          })
        }

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
