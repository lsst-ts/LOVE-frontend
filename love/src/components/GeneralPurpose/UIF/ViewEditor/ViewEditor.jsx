import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomView from '../CustomView';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import ComponentSelector from '../ComponentSelector/ComponentSelector';
import styles from './ViewEditor.module.css';


import 'brace/mode/json';
import 'brace/theme/solarized_dark';
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
    this.props.updateEditedView(parsedLayout);
  };

  onLayoutChange = (newLayoutProperties) => {
    let newLayout = this.props.editedView;
    newLayoutProperties.forEach((elementProperties) => {
      const parsedProperties = { ...elementProperties };
      parsedProperties.i = parseInt(elementProperties.i, 10);
      parsedProperties.allowOverflow = elementProperties.allowOverflow;
      newLayout = this.updateElementProperties(newLayout, parsedProperties);
    });
    this.setState({
      layout: JSON.stringify(newLayout, null, 2),
    });
    this.props.updateEditedView(newLayout);
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
    const currentLayout = {...this.props.editedView};
    const additionalContent = {};
    let i = Object.keys(currentLayout.content).length + 1;
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
    currentLayout.content = {...currentLayout.content, ...additionalContent};
    this.props.updateEditedView(currentLayout);
  }

  save = () => {
    console.log('save');
  }

  render() {
    return (
      <>
        <div className={styles.container}>
          <div>
            <CustomView layout={this.props.editedView} onLayoutChange={this.onLayoutChange}></CustomView>
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
              <Button onClick={this.save}>
                Save Changes
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
          <Button onClick={this.setLayout}>Apply</Button>
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
