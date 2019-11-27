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
        "w": 20,
        "h": 2,
        "i": 0,
        "cols": 20
      },
      "content": {
        "LeftPanel": {
          "properties": {
            "type": "component",
            "x": 0,
            "y": 0,
            "w": 12,
            "h": 5,
            "i": 1
          },
          "content": "MotorTable"
        },
        "RightPanel": {
          "properties": {
            "type": "container",
            "x": 0,
            "y": 5,
            "w": 5,
            "h": 2,
            "cols": 5,
            "i": 2
          },
          "content": {
            "TopComponent": {
              "properties": {
                "type": "component",
                "x": 0,
                "y": 0,
                "w": 5,
                "h": 9,
                "i": 3
              },
              "content": "SummaryPanel"
            },
            "BottomComponent": {
              "properties": {
                "type": "component",
                "x": 0,
                "y": 1,
                "w": 4,
                "h": 14,
                "i": 4
              },
              "content": "LightPath"
            }
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
      <div className={styles.container}>
        <div>
          <CustomView layout={this.state.parsedLayout} onLayoutChange={this.onLayoutChange}></CustomView>
        </div>
        <Rnd
          default={{
            x: 0,
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
      </div>
    );
  }
}
