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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EFDQuery from 'components/GeneralPurpose/EFDQuery/EFDQuery';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import { CardList, Card, Title, Separator } from 'components/GeneralPurpose/CardList/CardList';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import ErrorIcon from 'components/icons/ErrorIcon/ErrorIcon';
import TextField from 'components/TextField/TextField';
import { ISO_STRING_DATE_TIME_FORMAT, TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import ManagerInterface, { formatTimestamp, getStringRegExp, getEFDInstanceForHost } from 'Utils';
import styles from './EventLog.module.css';

export default class EventLog extends PureComponent {
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

  constructor(props) {
    super(props);

    const messageFilters = {
      10: { value: true, name: 'Debug' },
      20: { value: true, name: 'Info' },
      30: { value: true, name: 'Warning' },
      40: { value: true, name: 'Error' },
    };
    const typeFilters = {
      error: { value: true, name: 'Error code' },
      log: { value: true, name: 'Log message' },
    };
    this.state = {
      cscFilter: '',
      cscRegExp: getStringRegExp(''),
      messageFilters,
      typeFilters,
      eventData: [],
      queryData: [],
      efdEnabled: false,
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams(this.props.cscList);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams(this.props.cscList);
  };

  setEFDLogsCSCs = () => {
    const { cscList } = this.props;
    const cscTopicDict = {};
    cscList.forEach((obj) => {
      cscTopicDict[obj.name] = {};
    });
    cscList.forEach((obj) => {
      cscTopicDict[obj.name][obj.salindex] = {
        logevent_logMessage: [TOPIC_TIMESTAMP_ATTRIBUTE, 'level', 'message', 'traceback'],
        logevent_errorCode: [TOPIC_TIMESTAMP_ATTRIBUTE, 'errorCode', 'errorReport', 'traceback'],
      };
    });
    return cscTopicDict;
  };

  efdLogsResponse = (response) => {
    const queryData = [];
    Object.entries(response).forEach(([key, value]) => {
      const csc = key.split('-')[0];
      const index = key.split('-')[1];
      value.forEach((log) =>
        queryData.push({
          csc,
          salindex: index,
          // logevent_logMessage parameters
          level: log.level !== undefined ? { value: log.level } : undefined,
          message: log.message !== undefined ? { value: log.message } : undefined,
          // logevent_errorCode parameters
          errorCode: log.errorCode !== undefined ? { value: log.errorCode } : undefined,
          errorReport: log.errorReport !== undefined ? { value: log.errorReport } : undefined,
          // shared parameters
          traceback: { value: log.traceback },
          [TOPIC_TIMESTAMP_ATTRIBUTE]: { value: log[TOPIC_TIMESTAMP_ATTRIBUTE] },
        }),
      );
    });
    queryData.sort((a, b) => {
      return a[TOPIC_TIMESTAMP_ATTRIBUTE].value > b[TOPIC_TIMESTAMP_ATTRIBUTE].value ? -1 : 1;
    });
    this.setState({ queryData });
  };

  efdManagerInterface = (startDate, endDate) => {
    const cscInputs = this.setEFDLogsCSCs();
    const efdInstance = getEFDInstanceForHost();
    if (!efdInstance) {
      return;
    }

    const parsedStartDate = startDate.format(ISO_STRING_DATE_TIME_FORMAT);
    const parsedEndDate = endDate.format(ISO_STRING_DATE_TIME_FORMAT);
    return ManagerInterface.getEFDLogs(parsedStartDate, parsedEndDate, cscInputs, efdInstance).then((response) => {
      this.efdLogsResponse(response);
    });
  };

  changeCSCFilter = (event) => {
    this.setState({
      cscFilter: event.target.value,
      cscRegExp: getStringRegExp(event.target.value),
    });
  };

  updateMessageFilters = (key, value) => {
    const filters = this.state.messageFilters;
    filters[key].value = value;
    this.setState({
      messageFilters: { ...filters },
    });
  };

  updateTypeFilters = (key, value) => {
    const filters = this.state.typeFilters;
    filters[key].value = value;
    this.setState({
      typeFilters: { ...filters },
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.eventData?.length === 0 ||
      JSON.stringify(this.props.logMessageData) !== JSON.stringify(prevProps.logMessageData) ||
      JSON.stringify(this.props.errorCodeData) !== JSON.stringify(prevProps.errorCodeData)
    ) {
      const eventData = [...this.props.logMessageData.slice(0, 100), ...this.props.errorCodeData.slice(0, 50)];
      eventData.sort((a, b) =>
        a?.[TOPIC_TIMESTAMP_ATTRIBUTE]?.value > b?.[TOPIC_TIMESTAMP_ATTRIBUTE]?.value ? -1 : 1,
      );
      if (eventData.length !== 0) {
        this.setState({
          eventData,
        });
      }
    }
  };

  renderErrorMessage = (msg, index) => {
    const cscKey = `${msg.csc}.${msg.salindex}`;
    const filterResult = this.state.cscFilter === '' || this.state.cscRegExp.test(cscKey);
    return (
      filterResult && (
        <Card key={`${msg[TOPIC_TIMESTAMP_ATTRIBUTE].value}-${index}`} className={styles.card}>
          <div className={styles.messageTextContainer}>
            <div className={styles.messageTopSection}>
              <div className={styles.cardTitleContainer}>
                <span className={styles.highlight}>{cscKey}</span>
                <span className={styles.cardTitleContainer}>
                  <span>{' - '} Error code </span>
                  <span className={styles.highlight}> {msg.errorCode.value}</span>
                </span>
              </div>

              <div className={styles.timestamp} title={TOPIC_TIMESTAMP_ATTRIBUTE}>
                {formatTimestamp(msg[TOPIC_TIMESTAMP_ATTRIBUTE].value * 1000)}
              </div>
            </div>

            <Separator className={styles.innerSeparator} />
            <div className={styles.messageText}>{msg.errorReport.value}</div>
            <div className={styles.messageTraceback}>{msg.traceback.value}</div>
          </div>
        </Card>
      )
    );
  };

  renderLogMessage = (msg, index) => {
    const cscKey = `${msg.csc}.${msg.salindex}`;
    const filterResult = this.state.cscFilter === '' || this.state.cscRegExp.test(cscKey);
    let icon = <span title="Debug">d</span>;
    const { value } = msg?.level;
    if (value === 20) icon = <InfoIcon title="Info" />;
    if (value === 30) icon = <WarningIcon title="Warning" />;
    if (value === 40) icon = <ErrorIcon title="Error" />;

    return (
      filterResult &&
      this.state.messageFilters[value]?.value && (
        <Card key={`${msg[TOPIC_TIMESTAMP_ATTRIBUTE].value}-${msg.level.value}-${index}`} className={styles.card}>
          <div className={styles.messageTextContainer}>
            <div className={styles.messageTopSection}>
              <div className={styles.cardTitleContainer}>
                <span className={styles.highlight}>{cscKey}</span>
                <span className={styles.cardTitleContainer}>
                  <span>{' - '}</span>
                  <span className={styles.iconWrapper}>{icon}</span>
                  <span> {icon.props.title} log message</span>
                </span>
              </div>

              <div className={styles.timestamp} title={TOPIC_TIMESTAMP_ATTRIBUTE}>
                {formatTimestamp(msg[TOPIC_TIMESTAMP_ATTRIBUTE].value * 1000)}
              </div>
            </div>
            <Separator className={styles.innerSeparator} />
            <pre className={styles.preText}>{msg.message.value}</pre>
            <pre className={styles.preText}>{msg.traceback.value}</pre>
          </div>
        </Card>
      )
    );
  };

  render() {
    return (
      <div className={styles.CSCGroupLogContainer}>
        <CardList className={styles.cardList}>
          <Title className={styles.title}>Filters</Title>
          <div className={styles.filters}>
            <div className={styles.filter}>
              <span className={styles.filterLabel}>By CSC: </span>
              <TextField type="text" value={this.state.cscFilter} onChange={this.changeCSCFilter} />
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By type: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(this.state.typeFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          onChange={(event) => this.updateTypeFilters(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={this.state.typeFilters[key].value}
                        />
                        <span>{this.state.typeFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.filter}>
              <span className={styles.filterLabel}>By log level: </span>
              <div className={styles.filtersContainer}>
                {Object.keys(this.state.messageFilters).map((key) => {
                  return (
                    <div key={key}>
                      <label>
                        <input
                          onChange={(event) => this.updateMessageFilters(key, event.target.checked)}
                          type="checkbox"
                          alt={`select ${key}`}
                          checked={this.state.messageFilters[key].value}
                        />
                        <span>{this.state.messageFilters[key].name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.efdSelector}>
            <Toggle
              toggled={this.state.efdEnabled}
              labels={['Live', 'Historical']}
              onToggle={(event) => this.setState({ efdEnabled: event })}
            />
            {this.state.efdEnabled && <EFDQuery managerInterface={this.efdManagerInterface} />}
          </div>
          <Separator className={styles.separator} />
          {this.state.efdEnabled
            ? this.state.queryData.map((msg, index) => {
                return msg.errorCode !== undefined
                  ? this.state.typeFilters.error.value && this.renderErrorMessage(msg, index)
                  : this.state.typeFilters.log.value && this.renderLogMessage(msg, index);
              })
            : this.state.eventData.map((msg, index) => {
                return msg.errorCode !== undefined
                  ? this.state.typeFilters.error.value && this.renderErrorMessage(msg, index)
                  : this.state.typeFilters.log.value && this.renderLogMessage(msg, index);
              })}
        </CardList>
      </div>
    );
  }
}
