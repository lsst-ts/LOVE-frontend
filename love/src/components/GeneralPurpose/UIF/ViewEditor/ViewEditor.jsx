import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import CustomView from '../CustomView';
import ComponentSelector from '../ComponentSelector/ComponentSelector';
import styles from './ViewEditor.module.css';

import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import ConfigForm from './ConfigForm';

export default class ViewEditor extends Component {
  static propTypes = {
    /** Object representing the layout of the view being edited */
    editedView: PropTypes.object,
    /** Function to update the edited view */
    updateEditedView: PropTypes.func,
  };

  static defaultProps = {
    editedView: null,
    updateEditedView: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      layout: JSON.stringify(this.props.editedView, null, 2),
      selectedComponent: {},
    };
  }

  onChange = (newValue) => {
    this.setState({
      layout: newValue,
      showSelectionModal: false,
      showConfigModal: false,
    });
  };

  setLayout = () => {
    let parsedLayout = {};
    try {
      parsedLayout = JSON.parse(this.state.layout);
    } catch (error) {
      parsedLayout = {};
    }
    this.props.updateEditedView(parsedLayout);
  };

  onLayoutChange = (newLayoutProperties) => {
    const oldLayoutStr = JSON.stringify(this.props.editedView, null, 2);
    let newLayout = { ...this.props.editedView };
    newLayoutProperties.forEach((elementProperties) => {
      const parsedProperties = { ...elementProperties };
      parsedProperties.i = parseInt(elementProperties.i, 10);
      parsedProperties.allowOverflow = elementProperties.allowOverflow;
      newLayout = this.updateElementProperties(newLayout, parsedProperties);
    });
    const newLayoutStr = JSON.stringify(newLayout, null, 2);
    if (newLayoutStr !== oldLayoutStr) {
      this.setState({
        layout: newLayoutStr,
      });
      this.props.updateEditedView(newLayout);
    }
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

  hideSelectionModal = () => {
    this.setState({ showSelectionModal: false });
  };

  showSelectionModal = (e) => {
    this.setState({ showSelectionModal: true });
  };

  hideConfigModal = () => {
    this.setState({ showConfigModal: false });
  };

  showConfigModal = (e) => {
    this.setState({ showConfigModal: true });
  };

  receiveSelection = (selection) => {
    this.hideSelectionModal();
    const parsedLayout = { ...this.props.editedView };
    const additionalContent = {};
    let startingIndex = 0;
    Object.keys(parsedLayout.content).forEach((compKey) => {
      startingIndex = Math.max(parsedLayout.content[compKey].properties.i, startingIndex);
    });
    startingIndex += 1;

    selection.forEach((componentDict) => {
      const { schema } = componentDict;
      const { defaultSize } = schema;
      const componentConfig = schema.props;
      const defaultConfig = {};
      Object.keys(componentConfig).forEach((key) => {
        defaultConfig[key] = componentConfig[key].default;
      });
      additionalContent[`newPanel-${startingIndex}`] = {
        properties: {
          type: 'component',
          x: 0,
          y: 0,
          w: defaultSize[0],
          h: defaultSize[1],
          allowOverflow: schema.allowOverflow,
          i: startingIndex,
        },
        content: componentDict.name,
        config: defaultConfig,
      };
      startingIndex += 1;
    });
    parsedLayout.content = { ...parsedLayout.content, ...additionalContent };
    this.props.updateEditedView(parsedLayout);
  };

  onComponentDelete = (component) => {
    let parsedLayout = { ...this.props.editedView };
    Object.keys(parsedLayout.content).forEach((compKey) => {
      if (parsedLayout.content[compKey].content === component.content) delete parsedLayout.content[compKey];
    });
    this.props.updateEditedView(parsedLayout);
    return [];
  };

  onComponentConfig = (component) => {
    this.setState({
      selectedComponent: component,
      showConfigModal: true,
    });
  };

  save = () => {
    console.log('save');
  };

  render() {
    return (
      <>
        <div className={styles.container}>
          <div>
            <CustomView
              layout={this.props.editedView}
              onLayoutChange={this.onLayoutChange}
              onComponentDelete={this.onComponentDelete}
              onComponentConfig={this.onComponentConfig}
            ></CustomView>
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
              <Button onClick={this.showSelectionModal}>Add Components</Button>
              <Button onClick={this.save}>Save Changes</Button>
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
            <Button onClick={this.setLayout}>Apply</Button>
          </div>
        </Rnd>
        <Modal isOpen={this.state.showSelectionModal} onRequestClose={this.hideSelectionModal} contentLabel="Component selection modal">
          <ComponentSelector selectCallback={this.receiveSelection} />
        </Modal>
        <Modal
          isOpen={this.state.showConfigModal}
          onRequestClose={this.hideConfigModal}
          contentLabel="Component configuration modal"
        >
          <ConfigForm
            componentName={this.state.selectedComponent ? this.state.selectedComponent.content : ''}
            componentConfig={this.state.selectedComponent ? this.state.selectedComponent.config : {}}
          />
        </Modal>
      </>
    );
  }
}
