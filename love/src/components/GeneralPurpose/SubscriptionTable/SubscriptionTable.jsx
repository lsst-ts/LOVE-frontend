import React, { Component } from 'react';
import SummaryPanel from '../SummaryPanel/SummaryPanel';
import Label from '../SummaryPanel/Label';
import Value from '../SummaryPanel/Value';
import Title from '../SummaryPanel/Title';
import styles from './SubscriptionTable.module.css'

export default class SubscriptionTable extends Component {
  componentDidMount = () => {
    this.props.subscribeToStreams(this.props.subscriptions);
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams(this.props.subscriptions);
  };

  getAccessor = (group) => {
    if (Object.keys(this.props.accessors).includes(group)) return this.props.accessors[group];
    if (group.startsWith('event')) {
      return (data) => {
        const datum = data ? data[data.length - 1] : {};
        let keys = Object.keys(datum);
        keys = keys.filter((value) => !value.startsWith('private_') && value !== 'priority');
        const dict = {};
        keys.forEach((key) => (dict[key] = datum[key].value));
        return dict;
      };
    }
    if (group.startsWith('telemetry')) {
      return (data) => {
        const datum = data ? data : {};
        let keys = Object.keys(datum);
        keys = keys.filter((value) => !value.startsWith('private_') && value !== 'priority');
        const dict = {};
        keys.forEach((key) => (dict[key] = datum[key].value));
        return dict;
      };
    }
  };

  render() {
    return (
      <div className={styles.container}>
        <SummaryPanel>
          {this.props.subscriptions.map((group) => {
            const streamData = this.props.getStreamData(group);
            let dict = {};
            const accessor = this.getAccessor(group);
            try {
              dict = accessor(streamData);
            } catch (err) {
              console.error(err);
            }
            return (
              <React.Fragment key={group}>
                <Title wide>{group.split('-').splice(3)}</Title>
                {Object.keys(dict).map((key) => {
                  return (
                    <React.Fragment key={key}>
                      <Label>{key}</Label>
                      <Value raw={true}>{dict[key]}</Value>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </SummaryPanel>
      </div>
    );
  }
}
