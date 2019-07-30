import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroup.module.css';
import CSCDetail from '../CSCDetail/CSCDetail';
import CSCExpanded from '../CSCExpanded/CSCExpanded';
import CSCGroupLog from '../CSCGroupLog/CSCGroupLog';

export default class CSCGroup extends Component {
  static propTypes = {
    name: PropTypes.string,
    realm: PropTypes.string,
    cscs: PropTypes.array,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    selectedCSCs: PropTypes.array,
    hierarchy: PropTypes.object,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    heartbeatsData: PropTypes.arrayOf(PropTypes.object),
    summaryStateData: PropTypes.object,
    logMessageData: PropTypes.object,
    errorCodeData: PropTypes.object
  };

  static defaultProps = {
    name: '',
    realm: '',
    cscs: [],
    data: {},
    onCSCClick: () => 0,
    selectedCSCs: [],
    hierarchy: {},
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    heartbeatsData: [],
    summaryStateData: {},
    logMessageData: {},
    errorCodeData: {},
  };

  renderExpandedView = (selectedCSC) => {
    const groupView = selectedCSC.csc === 'all';
    
    return groupView ? (
      <div className={styles.CSCGroupContainer}>
        <CSCGroupLog
          realm={selectedCSC.realm}
          group={selectedCSC.group}
          name={selectedCSC.csc}
          data={this.props.data}
          onCSCClick={this.props.onCSCClick}
          hierarchy={this.props.hierarchy}
          clearCSCErrorCodes={this.props.clearCSCErrorCodes}
          summaryStateData={this.props.summaryStateData}
          logMessageData={this.props.logMessageData}
        />
      </div>
    ) : (
      <div className={styles.CSCGroupContainer}>
        <CSCExpanded
          realm={selectedCSC.realm}
          group={selectedCSC.group}
          name={selectedCSC.csc}
          salindex={selectedCSC.salindex}
          data={this.props.data}
          summaryStateData={this.props.summaryStateData[`${selectedCSC.csc}-${selectedCSC.salindex}`]}
          logMessageData={this.props.logMessageData[`${selectedCSC.csc}-${selectedCSC.salindex}`]}
          onCSCClick={this.props.onCSCClick}
          clearCSCErrorCodes={this.props.clearCSCErrorCodes}
          clearCSCLogMessages={this.props.clearCSCLogMessages}
          errorCodeData={this.props.errorCodeData[`${selectedCSC.csc}-${selectedCSC.salindex}`]}
        />
      </div>
    );
  };

  render() {

    let selectedCSC = this.props.selectedCSCs.filter((data) => {
      return data.realm === this.props.realm && data.group === this.props.name;
    });
    const expanded = selectedCSC.length > 0;
    [selectedCSC] = selectedCSC;
    return expanded ? (
      this.renderExpandedView(selectedCSC)
    ) : (
      <div className={styles.CSCGroupContainer}>
        <div
          className={styles.CSCGroupTitle}
          onClick={() => this.props.onCSCClick(this.props.realm, this.props.name, 'all')}
        >
          {this.props.name}
        </div>
        <div className={styles.CSCDetailsContainer}>
          {this.props.cscs.map((csc) => {
            return (
              <div key={csc.name+csc.salindex} className={styles.CSCDetailContainer}>
                <CSCDetail
                  realm={this.props.realm}
                  group={this.props.name}
                  name={csc.name}
                  salindex={csc.salindex}
                  data={this.props.data}
                  heartbeatData={this.props.heartbeatsData.filter((heartbeat) => heartbeat.csc === csc.name && heartbeat.salindex == csc.salindex)[0]}
                  summaryStateData={this.props.summaryStateData[csc.name+'-'+csc.salindex]}
                  onCSCClick={this.props.onCSCClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
