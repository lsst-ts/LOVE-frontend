import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';

export default class LastTarget extends Component {
  render() {
    const { isOpen } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Last Target</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <SummaryPanel>
            <Label>Time on target</Label>
            <Value>00:00:12</Value>
            <Label>MJD</Label>
            <Value>59954</Value>
            <Label>Right ascension</Label>
            <Value>15h 32m 38s</Value>
            <Label>Declination</Label>
            <Value>-20° 00' 15"</Value>
            <Label>Sky rotation</Label>
            <Value>135.00°</Value>
          </SummaryPanel>
          <SummaryPanel>
            <Label>Filter</Label>
            <Value>r</Value>
            <Label>N° of exposures</Label>
            <Value>10</Value>
            <Label>Exposure time</Label>
            <Value>2s</Value>
          </SummaryPanel>
          <div className={styles.infoPanel}>
            <h4 className={styles.infoLabel}>Info</h4>
            <div className={styles.infoContent}>
              Prediction algorith set error for target *name_target*, deprecated declination. Moved to next viable
              target: *next_target*
            </div>
          </div>
        </div>
      </div>
    );
  }
}
