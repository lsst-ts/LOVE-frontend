import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DraggableScript.module.css';

export default class AvailableScript extends Component {
  static propTypes = {
    children: PropTypes.object,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragEnd: PropTypes.func,
    id: PropTypes.number,
    pendingConfirmation: PropTypes.bool,
  };

  static defaultProps = {
    children: [],
    onDragEnd: () => 0,
    onDragOver: () => 0,
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
    this.props.onDragStart(e, this.props.id);
  };

  onDrop = () => {
    // console.log(e);
  };

  onDragOver = (e) => {
    // console.log(e);
    this.setState({
      dragOver: true,
    });
    this.props.onDragOver(e, this.props.id);
  };

  onDragLeave = () => {
    this.setState({
      dragOver: false,
    });
  };

  onDragEnd = (e) => {
    // console.log(e);
    this.setState({
      dragging: false,
    });
    this.props.onDragEnd(e, this.props.id);
  };

  render() {
    const draggingClass = this.state.dragging ? styles.dragging : '';
    const dragOverClass = this.state.dragOver ? styles.dragOver : '';
    const pendingClass = this.props.pendingConfirmation ? styles.pending : '';
    return (
      <div
        className={[styles.draggableContainer, draggingClass, dragOverClass, pendingClass].join(' ')}
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
