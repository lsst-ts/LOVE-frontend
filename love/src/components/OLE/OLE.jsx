import React, { Component } from 'react';
import styles from './OLE.module.css';
// import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
// import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';

class OLE extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    return (
      <div className={styles.oleContainer}>
        <div>
          <SummaryPanel className={styles.SummaryPanel}>
            <div>
              <Title>Observations()</Title>
            </div>
            <div className={styles.SummaryPanelLabels}>
              <Label>Instrument</Label>
              {/* <Value></Value> */}

              <Label>Date & Time</Label>
              {/* <Value></Value> */}

              <Label>Obs ID</Label>
              {/* <Value></Value> */}
            </div>
          </SummaryPanel>
        </div>
        <div>{/* <SimpleTable/> */}</div>
      </div>
    );
  }
}

export default OLE;
