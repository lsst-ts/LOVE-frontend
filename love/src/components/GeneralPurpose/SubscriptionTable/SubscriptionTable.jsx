import React, { Component } from 'react';
import SummaryPanel from '../SummaryPanel/SummaryPanel';
import Label from '../SummaryPanel/Label';
import Value from '../SummaryPanel/Value';
// import Title from '../SummaryPanel/Title';
import { CardList, Card, Title, SubTitle } from '../CardList/CardList';
import styles from './SubscriptionTable.module.css';

export default class SubscriptionTable extends Component {
  static defaultProps = {
    accessors: {},
    subscriptions: [],
  };

  constructor(props) {
    super(props);
    const subscriptionsDict = {};
    props.subscriptions.forEach((group) => {
      const [type, csc, index, topic] = group.split('-');
      const cscKey = `${csc}-${index}`;
      const topicKey = `${type}-${topic}`;
      if (subscriptionsDict[cscKey] === undefined) subscriptionsDict[cscKey] = [topicKey];
      else subscriptionsDict[cscKey] = [...subscriptionsDict[cscKey], topicKey];
    });
    this.state = {
      subscriptionsDict,
    };
  }

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
        <CardList>
          {Object.keys(this.state.subscriptionsDict).map((cscKey) => {
            return (
              <>
                <Title key={cscKey}>{cscKey}</Title>
                {this.state.subscriptionsDict[cscKey].map((topicKey) => {
                  const [type, topic] = topicKey.split('-');
                  const groupKey = [type, cscKey, topic].join('-');
                  const streamData = this.props.getStreamData(groupKey);
                  const accessor = this.getAccessor(groupKey);
                  const dict = accessor(streamData);
                  const dictKeys = Object.keys(dict);
                  return (
                    <>
                      <SubTitle key={topicKey} className={styles.subTitle}>
                        <span>{topic}</span>
                        <span className={styles.topicType}>{type}</span>
                      </SubTitle>
                      {dictKeys.length > 0 ? (
                        dictKeys.map((key) => {
                          return (
                            <>
                              <Card key={key} className={styles.card}>
                                <span className={styles.streamLabel}>{key}</span>
                                <span className={styles.streamValue}>
                                  <Value raw={true}>{dict[key]}</Value>
                                </span>
                              </Card>
                            </>
                          );
                        })
                      ) : (
                        <Card>
                          <div>No value</div>
                        </Card>
                      )}
                    </>
                  );
                })}
              </>
            );
          })}
        </CardList>

        {/* <SummaryPanel className={styles.subscriptionTable}>
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
                <Title wide>{`${group.split('-')[1]}-${group.split('-')[2]} (${group.split('-')[0]})`}</Title>
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
        </SummaryPanel> */}
      </div>
    );
  }
}
