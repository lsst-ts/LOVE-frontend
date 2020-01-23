import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
// import queryString from 'query-string';

import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import CustomView from '../CustomView';
import ComponentSelector from '../ComponentSelector/ComponentSelector';
import styles from './ViewEditor.module.css';
import { editViewStates, viewsStates } from '../../../../redux/reducers/uif';

import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import ConfigForm from './ConfigForm';

class ViewEditor extends Component {
  static propTypes = {
    /** React Router location object */
    location: PropTypes.object,
    /** Object representing the layout of the view being edited */
    editedViewCurrent: PropTypes.object,
    /** Object representing the extra data of the view being edited */
    editedViewSaved: PropTypes.object,
    /** Status of the view being edited */
    editedViewStatus: PropTypes.object,
    /** Status of the views request */
    viewsStatus: PropTypes.string,
    /** Function to update the edited view */
    updateEditedView: PropTypes.func,
    /** Function to load one of the views to the edited view */
    loadViewToEdit: PropTypes.func,
    /** Function to clear the edited view */
    clearEditedView: PropTypes.func,
    /** Function to save the edited view to the server (POST or PUT) */
    saveEditedView: PropTypes.func,
  };

  static defaultProps = {
    editedViewCurrent: {},
    editedViewSaved: {},
    editedViewStatus: { code: editViewStates.EMPTY },
    viewsStatus: viewsStates.EMPTY,
    updateEditedView: () => {},
    loadViewToEdit: () => {},
    clearEditedView: () => {},
    saveEditedView: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.editedViewCurrent ? this.props.editedViewCurrent.name : '',
      layout: JSON.stringify(this.getEditedViewLayout(), null, 2),
      selectedComponent: {},
      id: null,
    };
  }

  componentDidMount() {
    const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
    if (id === null) {
      this.props.clearEditedView();
      this.setState({
        layout: JSON.stringify(this.getEditedViewLayout(), null, 2),
      });
    } else {
      this.props.loadViewToEdit(id);
      this.setState({
        id,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.editedViewCurrent !== prevProps.editedViewCurrent) {
      this.setState({
        layout: JSON.stringify(this.getEditedViewLayout(), null, 2),
      });
    }
    if (prevProps.editedViewStatus !== this.props.editedViewStatus) {
      if (this.props.editedViewStatus.code === editViewStates.SAVING) {
        console.log('Saving');
      } else if (
        prevProps.editedViewStatus.code === editViewStates.SAVING &&
        this.props.editedViewStatus.code === editViewStates.SAVED
      ) {
        toast.success('View saved successfully');
      } else if (this.props.editedViewStatus.code === editViewStates.SAVE_ERROR) {
        const errorStr = this.props.editedViewStatus.details
          ? JSON.stringify(this.props.editedViewStatus.details)
          : null;
        toast.error(`Error saving view: ${errorStr}`);
      }
    }
    if (prevProps.viewsStatus === viewsStates.LOADING && this.props.viewsStatus === viewsStates.LOADED) {
      this.props.loadViewToEdit(this.state.id);
    }
  }

  getEditedViewLayout = () => {
    return this.props.editedViewCurrent ? this.props.editedViewCurrent.data : {};
  };

  updateEditedViewLayout = (newLayout) => {
    this.props.updateEditedView({
      ...this.props.editedViewCurrent,
      data: newLayout,
    });
  };

  onNameInputChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onNameInputBlur = (event) => {
    this.props.updateEditedView({
      ...this.props.editedViewCurrent,
      name: event.target.value,
    });
  };

  onEditorChange = (newValue) => {
    this.setState({
      layout: newValue,
      showSelectionModal: false,
      showConfigModal: false,
    });
  };

  applyEditorLayout = () => {
    let parsedLayout = {};
    try {
      parsedLayout = JSON.parse(this.state.layout);
    } catch (error) {
      parsedLayout = {};
    }
    this.updateEditedViewLayout(parsedLayout);
  };

  onLayoutChange = (newLayoutProperties) => {
    const oldLayoutStr = JSON.stringify(this.getEditedViewLayout(), null, 2);
    let newLayout = { ...this.getEditedViewLayout() };
    newLayoutProperties.forEach((elementProperties) => {
      const parsedProperties = { ...elementProperties };
      parsedProperties.i = parseInt(elementProperties.i, 10);
      parsedProperties.allowOverflow = elementProperties.allowOverflow;
      newLayout = this.updateElementProperties(newLayout, parsedProperties);
    });
    const newLayoutStr = JSON.stringify(newLayout, null, 2);
    this.setState({
      layout: newLayoutStr,
    });
    if (newLayoutStr !== oldLayoutStr) {
      this.updateEditedViewLayout(newLayout);
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
    if (element.properties.type === 'container') {
      Object.keys(element.content).forEach((key) => {
        newElement.content[key] = this.updateElementProperties(element.content[key], properties);
      });
    }
    return newElement;
  };

  updateElementConfig = (elementIndex, config) => {
    const parsedLayout = { ...this.getEditedViewLayout() };
    Object.keys(parsedLayout.content).forEach((key) => {
      const elem = parsedLayout.content[key];
      if (elem.properties.i === elementIndex) elem.config = config;
    });
    this.updateEditedViewLayout(parsedLayout);
    this.hideConfigModal();
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
    const parsedLayout = { ...this.getEditedViewLayout() };
    const additionalContent = {};
    let startingIndex = 0;
    if (parsedLayout) {
      Object.keys(parsedLayout.content).forEach((compKey) => {
        startingIndex = Math.max(parsedLayout.content[compKey].properties.i, startingIndex);
      });
    }
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
    this.updateEditedViewLayout(parsedLayout);
  };

  onComponentDelete = (component) => {
    const parsedLayout = { ...this.getEditedViewLayout() };
    Object.keys(parsedLayout.content).forEach((compKey) => {
      if (parsedLayout.content[compKey].content === component.content) delete parsedLayout.content[compKey];
    });
    this.updateEditedViewLayout(parsedLayout);
    return [];
  };

  onComponentConfig = (component) => {
    this.setState({
      selectedComponent: component,
      showConfigModal: true,
    });
  };

  save = () => {
    this.props.saveEditedView();
  };

  render() {
    return (
      <>
        <div className={styles.container}>
          <div>
            <CustomView
              layout={this.getEditedViewLayout()}
              onLayoutChange={this.onLayoutChange}
              onComponentDelete={this.onComponentDelete}
              onComponentConfig={this.onComponentConfig}
              isEditable={true}
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
              View:
              <Input
                className={styles.textField}
                defaultValue={this.props.editedViewCurrent ? this.props.editedViewCurrent.name : ''}
                onBlur={this.onNameInputBlur}
              />
              <Button onClick={this.showSelectionModal}>Add Components</Button>
              <Button onClick={this.save}>Save Changes</Button>
            </div>
            <AceEditor
              mode="json"
              theme="solarized_dark"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorChange}
              width={'100%'}
              value={this.state.layout}
              editorProps={{ $blockScrolling: true }}
              fontSize={18}
            />
            <Button onClick={this.applyEditorLayout}>Apply</Button>
          </div>
        </Rnd>
        <Modal
          isOpen={this.state.showSelectionModal}
          onRequestClose={this.hideSelectionModal}
          contentLabel="Component selection modal"
        >
          <ComponentSelector selectCallback={this.receiveSelection} />
        </Modal>
        <Modal
          isOpen={this.state.showConfigModal}
          onRequestClose={this.hideConfigModal}
          contentLabel="Component configuration modal"
        >
          <ConfigForm
            componentIndex={
              this.state.selectedComponent && this.state.selectedComponent.properties
                ? this.state.selectedComponent.properties.i
                : 1
            }
            componentName={this.state.selectedComponent ? this.state.selectedComponent.content : ''}
            componentConfig={this.state.selectedComponent ? this.state.selectedComponent.config : {}}
            onCancel={this.hideConfigModal}
            onSaveConfig={this.updateElementConfig}
          />
        </Modal>
      </>
    );
  }
}

export default withRouter(ViewEditor);
