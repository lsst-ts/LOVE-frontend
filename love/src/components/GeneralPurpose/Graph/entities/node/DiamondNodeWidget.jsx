import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import styles from './DiamondNodeWidget.module.css';
import { PortModelAlignment } from '../port/DiamondPortModel';

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

        {
          new Array(3).fill('LEFT').map((location, index) => {
            return (
              <StyledPortWidget
                key={index}
                left={0}
                top={this.props.size * (0.5 - (index - 1) * 0.2)}
                port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
                engine={this.props.engine} />
            )
          })
        }

        {
          new Array(3).fill('TOP').map((location, index) => {
            return (
              <StyledPortWidget
                key={index}
                left={this.props.size * (0.5 - (index - 1) * 0.2)}
                top={0}
                port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
                engine={this.props.engine} />
            )
          })
        }

        {
          new Array(3).fill('RIGHT').map((location, index) => {
            return (
              <StyledPortWidget
                key={index}
                left={this.props.size}
                top={this.props.size * (0.5 - (index - 1) * 0.2)}
                port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
                engine={this.props.engine} />
            )
          })
        }

        {
          new Array(3).fill('BOTTOM').map((location, index) => {
            return (
              <StyledPortWidget
                key={index}
                left={this.props.size * (0.5 - (index - 1) * 0.2)}
                top={this.props.size}
                port={this.props.node.getPort(PortModelAlignment[`${location}${index + 1}`])}
                engine={this.props.engine} />
            )
          })
        }
      </div>
    );
  }
}
