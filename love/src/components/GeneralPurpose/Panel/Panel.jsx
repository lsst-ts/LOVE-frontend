import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Panel.module.css';
import Button from '../Button/Button';
import GearIcon from '../../icons/GearIcon/GearIcon';

/**
 * A generic placeholder with a title that can be used
 * as a window or frame.
 */
export default class Panel extends Component {
  static propTypes = {
    /** Text to be displayed in the title */
    title: PropTypes.string,
    children: PropTypes.object,
    className: PropTypes.string,
    /** Wether to fit width to content */
    fit: PropTypes.bool,
    /** Wether to expand height to 100vh */
    expandHeight: PropTypes.bool,
    /** Wether to show the raw mode button */
    hasRawMode: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    className: '',
    expandHeight: false,
    hasRawMode: false,
  };

  constructor() {
    super();
    this.state = {
      isRaw: false,
    };
  }

  toggleRaw = () => {
    this.setState({
      isRaw: !this.state.isRaw,
    });
  };

  render() {
    const classNames = [
      styles.panel,
      this.props.className,
      this.props.fit ? styles.fit : '',
      this.props.expandHeight ? styles.expandHeight : '',
    ].join(' ');
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        index,
        isRaw: this.state.isRaw,
      });
    });
    return (
      <div className={classNames}>
        <div className={styles.panelHeading}>
          <h3 className={styles.panelTitle}>{this.props.title}</h3>
          <div className={styles.panelButtonWrapper}>
            {this.props.hasRawMode && (
              <Button onClick={() => this.toggleRaw()} className={styles.panelButton} size={'small'}>
                <span>{this.state.isRaw ? '<' : 'i'}</span>
              </Button>
            )}
          </div>
        </div>
        <div className={styles.panelBody}>{children}</div>
      </div>
    );
  }
}
