import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Collapse.module.css';

export default class Collapse extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    childrenHeight: PropTypes.number,
  };

  static defaultProps = {
    isOpen: false,
    childrenHeight: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
        childHeight: 0,
    }
  }

  componentDidMount() {
    const childHeightRaw = this.content.clientHeight;
    const childHeight = `${childHeightRaw / 16}rem`;
    this.setState({ childHeight: this.props.childrenHeight ?? childHeight});
  }

  render() {
    const { children, isOpen } = this.props;
    const { childHeight } = this.state;

    return (
      <div className={styles.collapse}
        style={{
          maxHeight: isOpen ? childHeight : 0
        }}
      >
        <div ref={content => (this.content = content)}>
            {children}
        </div>
      </div>
    );
  }
}
