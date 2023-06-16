import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Panel.module.css';
import Button from '../Button/Button';

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
    /** If a valid url, displayed as a link button in the title bar*/
    link: PropTypes.string,
  };

  static defaultProps = {
    title: undefined,
    className: '',
    expandHeight: false,
    hasRawMode: false,
  };

  constructor() {
    super();
    this.state = {
      isRaw: false,
      hasEUI: false,
    };
  }

  toggleRaw = () => {
    this.setState({
      isRaw: !this.state.isRaw,
    });
  };

  toggleEUI = () => {
    this.setState({
      hasEUI: !this.state.hasEUI,
    });
  };

  render() {
    const classNames = [
      styles.panel,
      this.props.title === undefined ? styles.noTitle : '',
      this.props.className,
      this.props.fit ? styles.fit : '',
      this.props.expandHeight ? styles.expandHeight : '',
    ].join(' ');
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        index,
        isRaw: this.state.isRaw,
        hasEUI: this.state.hasEUI,
      });
    });
    const hasLink = this.props.link && this.props.link !== '';
    return (
      <div className={classNames}>
        {this.props.title !== undefined && (
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>{this.props.title}</h3>
            <div className={[styles.panelButtonWrapper, hasLink ? styles.panelTwoButtonsWrapper : null].join(' ')}>
              {this.props.hasRawMode && (
                <Button
                  title={this.state.isRaw ? 'Regular view' : 'Raw telemetry data'}
                  onClick={() => this.toggleRaw()}
                  className={styles.panelButton}
                  size={'small'}
                >
                  {this.state.isRaw ? <span> &#5176; &nbsp; back</span> : <span>raw data</span>}
                </Button>
              )}
              {this.props.hasEUI && (
                <Button
                  title={this.state.hasEUI ? this.props.hasEUI.link : ''}
                  onClick={() => this.toggleEUI()}
                  className={styles.panelButton}
                  size={'small'}
                >
                  {this.state.hasEUI ? <span> &#5176; &nbsp; back</span> : <span>EUI</span>}
                </Button>
              )}
              {hasLink && (
                <Button
                  title={`External link: ${this.props.link}`}
                  onClick={() => window.open(this.props.link, '_blank')}
                  className={styles.panelButton}
                  size={'small'}
                >
                  <span>&#8599;</span>
                </Button>
              )}
            </div>
          </div>
        )}
        <div className={styles.panelBody}>{children}</div>
      </div>
    );
  }
}
