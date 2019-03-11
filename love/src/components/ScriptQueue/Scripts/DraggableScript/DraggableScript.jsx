import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DraggableScript.module.css';

export default class AvailableScript extends Component {
  static propTypes = {
    children: PropTypes.object,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragEnd: PropTypes.func,
    index: PropTypes.number,
    pendingConfirmation: PropTypes.bool,
    draggingScriptInstance: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    children: [],
    onDragEnd: () => 0,
    onDragOver: () => 0,
    onDragLeave: () => 0,
    onDragStart: () => 0,
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      dragOver: false,
      dragBottom: null,
    };
    this.ref = React.createRef();
  }

  onDragStart = (e) => {
    if (this.props.disabled) return;
    // console.log(e);
    // e.dataTransfer.setDragImage(null,50,50);
    this.setState({
      dragging: true,
      dragBottom: null,
    });
    this.props.onDragStart(e, this.props.index);
  };

  onDragOver = (e) => {
    const rect = e.target.getBoundingClientRect();
    const dragBottom = e.clientY > rect.top + rect.height / 2;
    this.setState({
      dragOver: true,
      dragBottom,
    });
    if (this.state.dragBottom !== null && this.state.dragBottom !== dragBottom) {
      this.props.onDragOver(e, this.props.index);
    }
  };

  onDragLeave = () => {
    this.setState({
      dragOver: false,
      dragBottom: null,
    });
  };

  onDragEnd = (e) => {
    this.setState({
      dragging: false,
    });
    this.props.onDragEnd(e, this.props.index);
  };

  render() {
    const draggingClass = this.state.dragging ? styles.dragging : '';
    const dragOverClass = this.state.dragOver ? styles.dragOver : '';
    const pendingClass = this.props.pendingConfirmation ? styles.pending : '';
    const globalDraggingClass = this.props.draggingScriptInstance !== undefined ? styles.globalDragging : '';
    return (
      <div
        className={[styles.draggableContainer, draggingClass, dragOverClass, pendingClass, globalDraggingClass].join(
          ' ',
        )}
        draggable={!this.props.disabled}
        onDragStart={this.onDragStart}
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
