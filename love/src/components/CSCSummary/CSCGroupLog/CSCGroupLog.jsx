import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroupLog.module.css';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import CSCDetail from '../CSCDetail/CSCDetail';
import Button from '../../Button/Button';

export default class CSCGroupLog extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    hierarchy: PropTypes.object,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
    hierarchy: {},
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
  };

  render() {
    const { props } = this;
    const { data } = this.props;
    const group = this.props.hierarchy[this.props.realm][this.props.group];
    const errorCodes = group
      .flatMap((csc) => {
        if (data[csc] && data[csc].errorCode) {
          return data[csc].errorCode.map((errorCode) => {
            return { csc, ...errorCode };
          });
        }
        return [];
      })
      .sort((csc1, csc2) => (csc1.timestamp > csc2.timestamp ? -1 : 1));
    errorCodes.length = 100;
    return (
      <div className={styles.CSCGroupLogContainer}>
        <div className={styles.topBarContainerWrapper}>
          <div className={styles.topBarContainer}>
            <div className={styles.breadcrumContainer}>
              <div
                className={styles.backArrowIconWrapper}
                onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, 'all')}
              >
                <BackArrowIcon />
              </div>
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
              <Button
                size="extra-small"
                onClick={() => this.props.clearCSCErrorCodes(this.props.realm, this.props.group, this.props.name)}
              >
                CLEAR
              </Button>
            </div>
          </div>
          <div className={[styles.log, styles.messageLogContent].join(' ')}>
            {errorCodes.map((msg) => {
              return (
                <div key={msg.timestamp} className={styles.logMessage}>
                  <div className={styles.errorCode} title={`Error code ${msg.errorCode}`}>
                    {msg.errorCode}
                  </div>
                  <div className={styles.messageTextContainer}>
                    <div className={styles.messageTopSection}>
                      {/* <div
                        className={styles.sourceCSC}
                        onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, msg.csc)}
                      >
                        {msg.csc}
                      </div> */}
                      <CSCDetail
                        realm={this.props.realm}
                        group={this.props.group}
                        name={msg.csc}
                        data={this.props.data}
                        onCSCClick={this.props.onCSCClick}
                      />
                      <div className={styles.timestamp}>{msg.timestamp}</div>
                    </div>
                    <div className={styles.messageText}>{msg.errorReport}</div>
                    <div className={styles.messageTraceback}>{msg.traceback}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
