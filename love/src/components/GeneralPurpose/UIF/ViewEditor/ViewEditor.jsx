import React, { Component } from 'react';
import styles from './ViewEditor.module.css';
import CustomView from '../CustomView';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import ComponentSelector from '../ComponentSelector/ComponentSelector';


import 'brace/mode/json';
import 'brace/theme/solarized_dark';
export default class ViewEditor extends Component {
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
            "x": 8,
            "y": 3,
            "w": 8,
            "h": 2,
            "i": 1
          },
          "content": "CSCDetail",
          "config": {
            "name": "Test",
            "salindex": 1,
            "onCSCClick": "() => {}",
            "_functionProps": ["onCSCClick"]
          }
        },
        "LeftPanel2": {
          "properties": {
            "type": "component",
            "x": 66,
            "y": 40,
            "w": 13,
            "h": 1,
            "i": 2
          },
          "content": "LabeledStatusText",
          "config": {
            "label": "Azimuth state2",
            "groupName": "event-ATMCS-0-m3State",
            "stateToLabelMap": {
              "0": "UNKOWN",
              "1": "TRACK_DISABLED",
              "2": "TRACK_ENABLED",
              "3": "STOPPING"
            },
            "stateToStyleMap": {
              "0": "unknown",
              "1": "ok",
              "2": "running",
              "3": "running"
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
      showModal: false,
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

  hideModal = () => {
    this.setState({ showModal: false });
  };

  showModal = e => {
    this.setState({ showModal: true });
  };

  receiveSelection = (selection) => {
    this.hideModal();
    let parsedLayout = {};
    try {
      parsedLayout = JSON.parse(this.state.layout);
    } catch (error) {
      parsedLayout = {};
    }

    const additionalContent = {};
    let i = Object.keys(parsedLayout.content).length + 1;
    for (const component of selection) {
      additionalContent['newPanel-' +  i] = {
        properties: {
          type: 'component',
          x: 60,
          y: 40,
          w: 13,
          h: 2,
          i: i,
        },
        content: component,
        config: {
          name: 'Test',
          salindex: 1,
          onCSCClick: () => {},
          _functionProps: ["onCSCClick"]
        }
      };
      i = i + 1;
    }
    parsedLayout.content = {...parsedLayout.content, ...additionalContent};
    this.setState({
      parsedLayout,
    });
  }

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
            <div className={styles.bar}>
              View editor
              <Button onClick={this.showModal}>
                Add Components
              </Button>
            </div>
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
          <Button onClick={this.setLayout}>Save changes</Button>
          </div>
        </Rnd>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.hideModal}
          contentLabel="Component selection modal"
        >
          <ComponentSelector selectCallback={this.receiveSelection}/>
        </Modal>
      </>
    );
  }
}
