import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DraggableScript.module.css';

export default class AvailableScript extends Component {
  static propTypes = {
    children: PropTypes.object,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    index: PropTypes.number,
  };

  static defaultProps = {
    children: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      dragOver: false,
    };
    this.ref = React.createRef();
  }

  onDragStart = (e) => {
    // console.log(e);
    // e.dataTransfer.setDragImage(null,50,50);
    this.setState({
      dragging: true,
    });
    this.props.onDragStart(e, this.props.index);
  };

  onDrop = () => {
    // console.log(e);
  };

  onDragOver = (e) => {
    // console.log(e);
    this.setState({
      dragOver: true,
    });
    this.props.onDragOver(e, this.props.index);
  };

  onDragLeave = () => {
    this.setState({
      dragOver: false,
    });
  };

  onDragEnd = () => {
    // console.log(e);
    this.setState({
      dragging: false,
    });
  };

  render() {
    const draggingClass = this.state.dragging ? styles.dragging : '';
    const dragOverClass = this.state.dragOver ? styles.dragOver : '';
    return (
      <div
        className={[styles.draggableContainer, draggingClass, dragOverClass].join(' ')}
        draggable="true"
        onDragStart={this.onDragStart}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        ref={this.ref}
      >
        {this.props.children}
      </div>
    );
  }
}
