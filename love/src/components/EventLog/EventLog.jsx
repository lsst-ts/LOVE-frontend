import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './EventLog.module.css';
import BackArrowIcon from '../icons/BackArrowIcon/BackArrowIcon';
import CSCDetailContainer from '../CSCSummary/CSCDetail/CSCDetail.container';
import Button from '../GeneralPurpose/Button/Button';
import { formatTimestamp } from '../../Utils';
import InfoIcon from '../icons/InfoIcon/InfoIcon';
import WarningIcon from '../icons/WarningIcon/WarningIcon';
import ErrorIcon from '../icons/ErrorIcon/ErrorIcon';
import { CardList, Card, Title, SubTitle, Separator } from '../GeneralPurpose/CardList/CardList';
import TextField from '../TextField/TextField';

export default class EventLog extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    subscribeToStream: PropTypes.func,
    errorCodeData: PropTypes.array,
    embedded: PropTypes.bool,
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

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log(this.props);
    this.props.subscribeToStreams(this.props.cscList);
  };

  clearGroupErrorCodes = () => {
    //   this.props.cscList.forEach(({ name, salindex }) => {
    //     this.props.clearCSCErrorCodes(name, salindex);
    //   });
  };

  renderErrorMessage = (msg, index) => {
    return (
      <Card key={`${msg.private_rcvStamp.value}-${index}`} className={styles.card}>
        <div className={styles.messageTextContainer}>
          <div className={styles.messageTopSection}>
            <div className={styles.cardTitleContainer}>
              <span className={styles.highlight}>{`${msg.csc}.${msg.salindex}`}</span>
              <span className={styles.cardTitleContainer}>
                <span>{' - '} Error code </span>
                <span className={styles.highlight}> {msg.errorCode.value}</span>
              </span>
            </div>

            <div className={styles.timestamp} title="private_rcvStamp">
              {formatTimestamp(msg.private_rcvStamp.value * 1000)}
            </div>
          </div>

          <Separator className={styles.innerSeparator} />
          <div className={styles.messageText}>{msg.errorReport.value}</div>
          <div className={styles.messageTraceback}>{msg.traceback.value}</div>
        </div>
      </Card>
    );
  };

  renderLogMessage = (msg, index) => {
    // const filter = messageFilters[msg.level.value];
    // if (filter && !filter.value) return null;
    let icon = <span title="Debug">d</span>;
    if (msg.level.value === 20) icon = <InfoIcon title="Info" />;
    if (msg.level.value === 30) icon = <WarningIcon title="Warning" />;
    if (msg.level.value === 40) icon = <ErrorIcon title="Error" />;
    return (
      <Card key={`${msg.private_rcvStamp.value}-${msg.level.value}-${index}`} className={styles.card}>
        <div className={styles.messageTextContainer}>
          <div className={styles.messageTopSection}>
            <div className={styles.cardTitleContainer}>
              <span className={styles.highlight}>{`${msg.csc}.${msg.salindex}`}</span>
              <span className={styles.cardTitleContainer}>
                <span>{' - '}</span>
                <span className={styles.iconWrapper}>{icon}</span>
                <span> {icon.props.title} log message</span>
              </span>
            </div>

            <div className={styles.timestamp} title="private_rcvStamp">
              {formatTimestamp(msg.private_rcvStamp.value * 1000)}
            </div>
          </div>
          <Separator className={styles.innerSeparator} />
          <div className={styles.messageText}>{msg.message.value}</div>
          <div className={styles.messageTraceback}>{msg.traceback.value}</div>
        </div>
      </Card>
    );
  };

  render() {
    const { props } = this;
    const messageFilters = {
      10: { value: true, name: 'Debug' },
      20: { value: true, name: 'Info' },
      30: { value: true, name: 'Warning' },
      40: { value: true, name: 'Error' },
    };
    const typeFilters = {
      'error': { value: true, name: 'Error code' },
      'log': { value: true, name: 'Log message' },
    };


    return (
      <div className={styles.CSCGroupLogContainer}>
        <CardList className={styles.cardList}>
          <Title className={styles.title}>Filters</Title>
          <div className={styles.filters}>
            <div className={styles.filter}>
              <span className={styles.filterLabel}>By CSC: </span>
              <TextField type="text" value={''} onChange={this.changeTopicFilter} />
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By type: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(typeFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          // onChange={(event) => updateFilter(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={typeFilters[key].value}
                        />
                        <span>{typeFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By log level: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(messageFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          // onChange={(event) => updateFilter(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={messageFilters[key].value}
                        />
                        <span>{messageFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Separator className={styles.separator} />

          {this.props.errorCodeData.map((msg, index) => {
            return this.renderErrorMessage(msg, index);
          })}
          {this.props.logMessageData.map((msg, index) => {
            return this.renderLogMessage(msg, index);
          })}
        </CardList>
      </div>
    );
  }
}
