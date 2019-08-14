import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';
import Panel from '../GeneralPurpose/Panel/Panel';

export default class CSCSummary extends Component {
  static propTypes = {
    hierarchy: PropTypes.object,
  };
  static defaultProps = {
    hierarchy: {
      'Aux Telescope': {
        'CSC Group 1': [{ name: 'ScriptQueue', salindex: 1 }, { name: 'ATDome', salindex: 1 }],
      },
      'Main Telescope': {
        'CSC Group 1': [{ name: 'CSC4', salindex: 0 }],
        'CSC Group 2': [],
      },
      Observatory: {
        'CSC Group 1': [],
      },
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedCSCs: [],
      // selectedCSCs: [{ realm: 'Aux Telescope', group: 'CSC Group 1', csc: 'ATCamera' }],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  toggleCSCExpansion = (realm, group, csc, salindex) => {
    const newSelectedCSCs = [...this.state.selectedCSCs];

    for (let i = 0; i < this.state.selectedCSCs.length; i += 1) {
      const currentCSC = this.state.selectedCSCs[i];
      if (realm === currentCSC.realm && group === currentCSC.group) {
        newSelectedCSCs.splice(i, 1);
        if (csc === currentCSC.csc && salindex === currentCSC.salindex) {
          this.setState({ selectedCSCs: newSelectedCSCs });
          return;
        }
      }
    }
    this.setState({
      selectedCSCs: [...newSelectedCSCs, { realm, group, csc, salindex }],
    });
  };

  render() {
    return (
      <Panel title="CSC Summary" className={styles.panel}>
        <div className={styles.CSCSummaryContainer}>
          {Object.keys(this.props.hierarchy).map((realm) => {
            return (
              <div key={realm} className={styles.CSCRealmContainer}>
                <CSCRealm
                  name={realm}
                  groups={this.props.hierarchy[realm]}
                  onCSCClick={this.toggleCSCExpansion}
                  selectedCSCs={this.state.selectedCSCs}
                  hierarchy={this.props.hierarchy}
                />
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }
}
