import React, { Component } from 'react';
import styles from './CustomViewEditor.module.css';
import CustomView from '../CustomView';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';

import 'brace/mode/json';
import 'brace/theme/solarized_dark';
export default class CustomViewEditor extends Component {
  constructor() {
    super();
    const layout = `
    {
      "properties": {
        "type": "container",
        "x": 0,
        "y": 0,
        "w": 100,
        "h": 2,
        "i": 0,
        "allowOverflow": true,
        "cols": 100
      },
      "content": {
        "LeftPanel": {
          "properties": {
            "type": "component",
            "x": 0,
            "y": 0,
            "w": 48,
            "h": 38,
            "i": 1
          },
          "content": "Dome",
          "config": {
            "label": "Azimuth state",
            "groupName": "event-ATMCS-0-atMountState",
            "stateToLabelMap": {
              "0": "unknown",
              "1": "TRACK_DISABLED",
              "2": "TRACK_ENABLED",
              "3": "STOPPING"
            },
            "stateToStyleMap": {
              "0": "unknown",
              "1": "ok",
              "2": "running",
              "3": "running"
            }
          }
        },
        "LeftPanel2": {
          "properties": {
            "type": "component",
            "x": 66,
            "y": 98,
            "w": 13,
            "h": 1,
            "i": 2
          },
          "content": "LabeledStatusText",
          "config": {
            "label": "Azimuth state2",
            "groupName": "event-ATMCS-0-m3State",
            "stateToLabelMap": {
              "0": "TRACK_DISABLED",
              "1": "TRACK_ENABLED",
              "2": "STOPPING"
            },
            "stateToStyleMap": {
              "0": "ok",
              "1": "running",
              "2": "running"
            },
            "accessor": "(event) => event.state.value",
            "_functionProps": ["accessor"]
          }
        }
      }
    }
    `;
    this.state = {
      layout,
      parsedLayout: JSON.parse(layout),
    };
  }

  onChange = (newValue) => {
    this.setState({
      layout: newValue,
    });
  };

  setLayout = () => {
    let parsedLayout = {};
    try {
      parsedLayout = JSON.parse(this.state.layout);
    } catch (error) {
      parsedLayout = {};
    }
    this.setState({
      parsedLayout,
    });
  };

  onLayoutChange = (newLayoutProperties) => {
    let newParsedLayout = this.state.parsedLayout;
    newLayoutProperties.forEach((elementProperties) => {
      const parsedProperties = { ...elementProperties };
      parsedProperties.i = parseInt(elementProperties.i, 10);
      parsedProperties.allowOverflow = elementProperties.allowOverflow;
      newParsedLayout = this.updateElementProperties(newParsedLayout, parsedProperties);
    });
    this.setState({
      parsedLayout: newParsedLayout,
      layout: JSON.stringify(newParsedLayout, null, 2),
    });
  };

  updateElementProperties = (element, properties) => {
    const newElement = { ...element };
    if (element.properties.i === properties.i) {
      newElement.properties = {
        ...element.properties,
        x: properties.x,
        y: properties.y,
        w: properties.w,
        h: properties.h,
        cols: properties.cols,
      };
      return newElement;
    }
    if (element.properties.type == 'container') {
      Object.keys(element.content).map((key) => {
        newElement.content[key] = this.updateElementProperties(element.content[key], properties);
      });
    }
    return newElement;
  };

  render() {
    return (
      <>
      <div className={styles.container}>
        <div>
          <CustomView layout={this.state.parsedLayout} onLayoutChange={this.onLayoutChange}></CustomView>
        </div>
      </div>
        <Rnd
          default={{
            x: 800,
            y: 50,
            width: 500,
            height: 200,
          }}
          style={{ zIndex: 1000 }}
          bounds={'parent'}
          enableUserSelectHack={false}
          dragHandleClassName={styles.bar}
          onResize={this.onResize}
        >
          <div>
            <div className={styles.bar}>Editor</div>
            <AceEditor
              mode="json"
              theme="solarized_dark"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onChange}
              width={'100%'}
              value={this.state.layout}
              editorProps={{ $blockScrolling: true }}
              fontSize={18}
            />
            <button onClick={this.setLayout}>Set</button>
          </div>
        </Rnd>
        </>
    );
  }
}
