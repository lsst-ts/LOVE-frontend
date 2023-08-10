/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import styles from './CSCGroupLog.module.css';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import CSCDetailContainer from '../CSCDetail/CSCDetail.container';
import Button from '../../GeneralPurpose/Button/Button';
import { formatTimestamp } from '../../../Utils';

export default class CSCGroupLog extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    subscribeToStream: PropTypes.func,
    unsubscribeToStream: PropTypes.func,
    errorCodeData: PropTypes.array,
    embedded: PropTypes.bool,
    cscList: PropTypes.array,
  };

  static defaultProps = {
    name: '',
    group: '',
    data: {},
    onCSCClick: () => 0,
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    errorCodeData: [],
    embedded: false,
  };

  componentDidMount = () => {
    this.props.cscList.forEach(({ name, salindex }) => {
      this.props.subscribeToStream(name, salindex);
    });
  };

  componentWillUnmount = () => {
    this.props.cscList.forEach(({ name, salindex }) => {
      this.props.unsubscribeToStream(name, salindex);
    });
  };

  clearGroupErrorCodes = () => {
    this.props.cscList.forEach(({ name, salindex }) => {
      this.props.clearCSCErrorCodes(name, salindex);
    });
  };

  render() {
    const { props } = this;
    return (
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCGroupLogContainer}>
          <div className={styles.topBarContainerWrapper}>
            <div className={styles.topBarContainer}>
              <div className={styles.breadcrumContainer}>
                {this.props.embedded && (
                  <div
                    className={styles.backArrowIconWrapper}
                    onClick={() => this.props.onCSCClick({ group: this.props.group })}
                  >
                    <BackArrowIcon />
                  </div>
                )}
                <span className={styles.breadcrumbGroup}>
                  {props.group} {' (Error codes)'}
                </span>
              </div>
            </div>
          </div>
          <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
            <div className={styles.logContainerTopBar}>
              <div>ERROR CODE</div>
              <div>
                <Button size="extra-small" onClick={() => this.clearGroupErrorCodes()}>
                  CLEAR
                </Button>
              </div>
            </div>
            <div className={[styles.log, styles.messageLogContent].join(' ')}>
              {this.props.errorCodeData.map((msg, index) => {
                return (
                  <div key={`${msg.private_rcvStamp.value}-${index}`} className={styles.logMessage}>
                    <div className={styles.errorCode} title={`Error code ${msg.errorCode.value}`}>
                      {msg.errorCode.value}
                    </div>
                    <div className={styles.messageTextContainer}>
                      <div className={styles.messageTopSection}>
                        <CSCDetailContainer
                          group={this.props.group}
                          name={msg.csc}
                          salindex={msg.salindex}
                          data={this.props.data}
                          onCSCClick={this.props.onCSCClick}
                          embedded={true}
                        />
                        <div className={styles.timestamp} title="private_rcvStamp">
                          {formatTimestamp(msg.private_rcvStamp.value * 1000)}
                        </div>
                      </div>
                      <div className={styles.messageText}>{msg.errorReport.value}</div>
                      <div className={styles.messageTraceback}>{msg.traceback.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
