import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptList.module.css';

export default class ScriptList extends Component {
  static propTypes = {
    children: PropTypes.array,
    onDragLeave: PropTypes.func,
    onDragExit: PropTypes.func,
    onDragEnd: PropTypes.func,
  };

  static defaultProps = {
    onDragLeave: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragCounter: 0,
    };
    this.dragCounter = 0;
  }

  onDragEnter = (e) => {
    this.setState({
      dragCounter: this.state.dragCounter + 1,
    });
    this.dragCounter += 1;
    e.stopPropagation();
    e.preventDefault();
  };

  onDragLeave = () => {
    this.dragCounter -= 1;
    // if(this.state.dragCounter-1 === 0)
    //   this.props.onDragLeave(e);
    this.setState({
      dragCounter: this.state.dragCounter - 1,
    });
  };

  render() {
    return (
      <div
        className={styles.scriptListWrapper}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragExit={this.props.onDragExit}
        onDragEnd={this.props.onDragEnd}
      >
        <div className={styles.scriptListContainer}>{this.props.children}</div>
      </div>
    );
  }
}
