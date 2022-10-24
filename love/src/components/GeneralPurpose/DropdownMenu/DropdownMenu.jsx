import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './DropdownMenu.module.css';

export default class DropdownMenu extends PureComponent {
  static propTypes = {
    disabledToggle: PropTypes.bool,
  };

  static defaultProps = {
    disabledToggle: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  toggleOpen = (event) => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleDocumentClick = (event) => {
    if (this.props.disabledToggle) {
      return;
    }
    if (this.refButtonNode && !this.refButtonNode.contains(event.target)) {
      this.setState({
        isOpen: false,
      });
    }
  };

  render() {
    let firstChild;
    let children;
    if (this.props.children.length > 1) [firstChild, ...children] = this.props.children;
    else firstChild = this.props.children;
    const { className } = this.props;
    return (
      <span className={[styles.refNode, className].join(' ')}>
        <span onClick={this.toggleOpen} ref={(node) => (this.refButtonNode = node)}>
          {firstChild}
        </span>
        {this.state.isOpen && (
          <div className={[styles.dropdown, this.state.isOpen ? styles.isOpen : ''].join(' ')}>{children}</div>
        )}
      </span>
    );
  }
}
