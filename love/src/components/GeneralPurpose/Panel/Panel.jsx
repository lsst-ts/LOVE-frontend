/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
    /** If the component have a EUI, displayed as a link button in the tittle bar */
    EUI: PropTypes.string,
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
      this.props.title === undefined ? styles.noTitle : '',
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
    const hasLink = this.props.link && this.props.link !== '';
    const hasEUI = this.props.EUI && this.props.EUI !== '';
    return (
      <div className={classNames}>
        {this.props.title !== undefined && (
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>{this.props.title}</h3>
            <div className={[styles.panelButtonWrapper, hasLink ? styles.panelTwoButtonsWrapper : null].join(' ')}>
              {hasEUI && (
                <Button
                  title={`External link: ${this.props.EUI}`}
                  onClick={() => window.open(this.props.EUI, '_blank')}
                  className={styles.panelButton}
                  size={'small'}
                >
                  <span>EUI</span>
                </Button>
              )}
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
