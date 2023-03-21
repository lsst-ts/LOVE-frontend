import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import { M1M3ActuatorPositions } from 'Config';
import styles from './Map.module.css';
import Badge from '../../GeneralPurpose/Badge/Badge';

import Level1 from './Levels/Level1.jsx'
import Level2 from './Levels/Level2.jsx'
import Level3 from './Levels/Level3.jsx'
import Level4 from './Levels/Level4.jsx'
import Level5 from './Levels/Level5.jsx'
import Level6 from './Levels/Level6.jsx'
import Level7 from './Levels/Level7.jsx'
import Level8 from './Levels/Level8.jsx'

import * as d3 from 'd3';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarms: [],
      selectedTab:'level_1',
      zoomTransform: null,
      zoomLevel: 1,
      translateX:0,
      translateY:0,
    };
  }

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  floorSelect(tab){
        switch(tab){
      case 'level_1':
        return (<Level1/>);
      case 'level_2':
        return (<Level2/>);
      case 'level_3':
        return (<Level3/>);
      case 'level_4':
        return (<Level4/>);
      case 'level_5':
        return (<Level5/>);
      case 'level_6':
        return (<Level6/>);
      case 'level_7':
        return (<Level7/>);
      case 'level_8':
        return (<Level8/>);
      default:
        return'';
    }
  }


stopZoom = () => {
  console.log('stop');
    this.setState({
      translateX: 0,
      translateY: 0,
    });
}

componentDidMount(){
    d3.select("#Map")
    .attr("width","100%")
    .attr("height","100%")
    .call(d3.zoom().scaleExtent([1, 8]).on("zoom",function(){
      d3.select("#Map").attr("transform",(d3.event.transform))
    }))

};

componentDidUpdate(){
}

  render() {
    const { zoomLevel, translateX, translateY } = this.state;
    //const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const alarms={
      "Level 1" : {},
      "Level 2" : {},
      "Level 3" : {},
      "Level 4" : {},
      "Level 5" : {},
      "Level 6" : {},
      "Level 7" : {},
      "Level 8" : {},
    };

    return (

        <div className={styles.tabsWrapper}>

          <div className={styles.tabsRow}>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_1' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_1')}
            >
              <div className={styles.tabLabel}>
                Level 1
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_2' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_2')}
            >
              <div className={styles.tabLabel}>
                Level 2
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_3' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_3')}
            >
              <div className={styles.tabLabel}>
                Level 3
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_4' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_4')}
            >
              <div className={styles.tabLabel}>
                Level 4
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_5' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_5')}
            >
              <div className={styles.tabLabel}>
                Level 5
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_6' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_6')}
            >
              <div className={styles.tabLabel}>
                Level 6
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_7' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_7')}
            >
              <div className={styles.tabLabel}>
                Level 7
              </div>
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'level_8' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('level_8')}
            >
              <div className={styles.tabLabel}>
                Level 8
              </div>
            </div>

          </div>

          <div className={[styles.mapWrapper, this.props.embedded ? styles.embedded : ''].join(' ')}>

            <svg id="Map"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 882.42 461.23">
                {this.floorSelect(this.state['selectedTab'])}
            </svg>

          </div>
        </div>
    );
  }
}
