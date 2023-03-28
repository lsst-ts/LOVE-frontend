import React, { Component } from 'react';
import styles from './Pointing.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import { fixedFloat } from 'Utils';

export default class Pointing extends Component {
  render() {
    const {  pointingRa, pointingDecl, pointingPosAngle, pointingParallAngle } = this.props;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title wide className={styles.titles}>
            Pointing
          </Title>
          <Label>Ra</Label>
          <Value>{`${fixedFloat(pointingRa, 2)} °`}</Value>
          <Label>Dec</Label>
          <Value>{`${fixedFloat(pointingDecl, 2)} °`}</Value>
          <Label>Sky pos</Label>
          <Value>{`${fixedFloat(pointingPosAngle, 2)} °`}</Value>
          <Label>Parallactic</Label>
          <Value>{`${fixedFloat(pointingParallAngle, 2)} °`}</Value>
        </SummaryPanel>
      </div>
    );
  }
}
