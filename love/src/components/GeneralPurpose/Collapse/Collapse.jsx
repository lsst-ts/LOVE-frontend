import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Collapse.module.css';

export default class Collapse extends Component {
  static propTypes = {
    /** Props for the state variable used for the change between open and closed of the collapsed div */
    isOpen: PropTypes.bool.isRequired,
    /** Max Height size of the children component */
    childrenMaxHeight: PropTypes.number.isRequired,
    /** Content of the inner the collapse div */
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  };

  static defaultProps = {
    isOpen: false,
    childrenMaxHeight: undefined,
    children: <></>,
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
    this.setState({ childHeight: this.props.childrenMaxHeight ?? childHeight});
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
