import React, { Component } from 'react';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import PropTypes from 'prop-types';
import SimpleTable from '../GeneralPurpose/SimpleTable/SimpleTable';
import Limits from '../GeneralPurpose/Limits/Limits';
import styles from './ObservatorySummary.module.css';
import SummaryPanel from '../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../GeneralPurpose/SummaryPanel/Label';
import Value from '../GeneralPurpose/SummaryPanel/Value';
import Title from '../GeneralPurpose/SummaryPanel/Title';

export default class ObservatorySummary extends Component {
  static propTypes = {
};

  static defaultProps = {};

  render() {

    return (
    <div className={styles.container}>

      <SummaryPanel className={styles.row2}>
      	<Title wide>Simonyi Telescope</Title>
      	<Label>Summary</Label>
      	<Value>
      		<StatusText status={'invalid'}>
      			UNKNOWN
      		</StatusText>
      	</Value>
      	<Label>Operation Mode</Label>
      	<Value>UNKNOWN</Value>
      	<Label>Obsv. Mode</Label>
      	<Value>{this.props.simonyiObservingMode}</Value>
      	<Label>Tracking Mode</Label>
      	<Value>UNKNOWN</Value>
      	<Label>Power Source</Label>
      	<Value>UNKNOWN</Value>
      </SummaryPanel>

      <SummaryPanel>
      	<Title wide>Vera C. Rubin Observatory</Title>
      	<Label>Control</Label>
      	<Value>UNKNOWN</Value>
      	<Label>Power Source</Label>
      	<Value>UNKNOWN</Value>
      </SummaryPanel>

      <SummaryPanel>
      	<Title wide>Auxiliary Telescope</Title>
      	<Label>Summary</Label>
      	<Value>
      		<StatusText status={'invalid'}>
      			UNKNOWN
      		</StatusText>
      	</Value>
      	<Label>Operation Mode</Label>
      	<Value>UNKNOWN</Value>
      	<Label>Obsv. Mode</Label>
      	<Value>{this.props.auxtelObservingMode}</Value>
      	<Label>Power Source</Label>
      	<Value>UNKNOWN</Value>
      </SummaryPanel>
    </div>
    );
  }
}
