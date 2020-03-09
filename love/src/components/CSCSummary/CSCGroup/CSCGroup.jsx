import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroup.module.css';
import CSCDetailContainer from '../CSCDetail/CSCDetail.container';
import CSCExpandedContainer from '../CSCExpanded/CSCExpanded.container';
import CSCGroupLogContainer from '../CSCGroupLog/CSCGroupLog.container';

export default class CSCGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCSC: undefined,
    };
  }
  static propTypes = {
    name: PropTypes.string,
    cscs: PropTypes.array,
    onCSCClick: PropTypes.func,
    embedded: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    cscs: [],
    subscribeToStreams: () => 0,
    selectedCSC: undefined,
    embedded: false,
  };

  componentDidMount = () => {
    if (this.props.cscs !== undefined) {
      this.props.cscs.forEach((csc) => {
        this.props.subscribeToStreams(csc.name, csc.salindex);
      });
    }
  };

  renderExpandedView = (selectedCSC) => {
    const groupView = selectedCSC.csc === 'all';

    return groupView ? (
      <CSCGroupLogContainer
        group={selectedCSC.group}
        name={selectedCSC.csc}
        onCSCClick={this.onCSCClick}
        cscList={this.props.cscs}
        embedded={true}
      />
    ) : (
      <CSCExpandedContainer
        group={selectedCSC.group}
        name={selectedCSC.csc}
        salindex={selectedCSC.salindex}
        onCSCClick={this.onCSCClick}
      />
    );
  };

  onCSCClick = ({ group, csc, salindex }) => {
    if (!csc) {
      this.setState({
        selectedCSC: undefined,
      });
      return;
    }

    this.setState({
      selectedCSC: {
        group,
        csc,
        salindex,
      },
    });
  };
  render() {
    let { selectedCSC } = this.state;
    return selectedCSC ? (
      this.renderExpandedView(selectedCSC)
    ) : (
      <div className={styles.CSCGroupContainer}>
        <div
          className={styles.CSCGroupTitle}
          onClick={() => this.onCSCClick({  group: this.props.name, csc: 'all' })}
        >
          {this.props.name}
        </div>
        <div className={styles.CSCDetailsContainer}>
          {this.props.cscs.map((csc) => {
            return (
              <div key={csc.name + csc.salindex} className={styles.CSCDetailContainer}>
                <CSCDetailContainer
                  group={this.props.name}
                  name={csc.name}
                  salindex={csc.salindex}
                  hasHeartbeat={csc.hasHeartbeat}
                  onCSCClick={this.onCSCClick}
                  embedded={true}
                  shouldSubscribe={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
