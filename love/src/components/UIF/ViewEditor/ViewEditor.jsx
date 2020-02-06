import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
// import queryString from 'query-string';
import { editViewStates, viewsStates, modes } from '../../../redux/reducers/uif';
import Button from '../../GeneralPurpose/Button/Button';
import Input from '../../GeneralPurpose/Input/Input';
import Modal from '../../GeneralPurpose/Modal/Modal';
import CustomView from '../CustomView';
import ComponentSelector from '../ComponentSelector/ComponentSelector';
import styles from './ViewEditor.module.css';
import SaveIcon from '../../icons/SaveIcon/SaveIcon';
import AddIcon from '../../icons/AddIcon/AddIcon';
import UndoIcon from '../../icons/UndoIcon/UndoIcon';
import RedoIcon from '../../icons/RedoIcon/RedoIcon';
import DebugIcon from '../../icons/DebugIcon/DebugIcon';
import rfdc from 'rfdc';

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
    /** Function to undo the latest layout modification */
    undo: PropTypes.func,
    /** Function to redo the latest layout modification */
    redo: PropTypes.func,
    /** Function to change the mode between VIEW and EDIT */
    changeMode: PropTypes.func,
    /** Number of undo actions available */
    undoActionsAvailable: PropTypes.number,
    /** Number of redo actions available */
    redoActionsAvailable: PropTypes.number,
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
      editorVisible: false,
      editorChanged: false,
    };
    this.toolbar = document.createElement('div');
  }

  componentDidMount() {
    this.topbarRoot = document.getElementById('customTopbar');
    this.topbarRoot.appendChild(this.toolbar);
    this.props.changeMode(modes.EDIT);
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

  componentWillUnmount() {
    this.topbarRoot.removeChild(this.toolbar);
    this.props.changeMode(modes.VIEW);
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
      editorChanged: true,
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
    this.setState({ editorChanged: false });
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
        ...newElement.properties,
        x: properties.x,
        y: properties.y,
        w: properties.w,
        h: properties.h,
        cols: properties.cols,
      };
      return newElement;
    }
    if (element.properties.type === 'container') {
      newElement.content = { ...element.content };
      Object.keys(element.content).forEach((key) => {
        newElement.content[key] = this.updateElementProperties(newElement.content[key], properties);
      });
    }
    return newElement;
  };

  updateElementConfig = (elementIndex, config) => {
    const parsedLayout = { ...this.getEditedViewLayout() };
    parsedLayout.content = { ...parsedLayout.content };
    Object.keys(parsedLayout.content).forEach((key) => {
      const elem = {...parsedLayout.content[key]};
      if (elem.properties.i === elementIndex) elem.config = config;
      parsedLayout.content[key] = elem;
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

  showEditor = (e) => {
    this.setState({ editorVisible: true });
  };

  hideEditor = (e) => {
    this.setState({ editorVisible: false });
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
    parsedLayout.content = { ...parsedLayout.content };
    Object.keys(parsedLayout.content).forEach((compKey) => {
      if (parsedLayout.content[compKey].properties.i === component.properties.i) delete parsedLayout.content[compKey];
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

  renderToolbar() {
    const isSaved = this.props.editedViewStatus && this.props.editedViewStatus.code === editViewStates.SAVED;
    const saveButtonTooltip = isSaved ? 'Nothing to save' : 'Save changes';
    return (
      <div className={styles.toolbarWrapper}>
      <div className={styles.toolbar}>
        <Input
          className={styles.textField}
          defaultValue={this.props.editedViewCurrent ? this.props.editedViewCurrent.name : ''}
          onBlur={this.onNameInputBlur}
          key={this.props.editedViewCurrent ? this.props.editedViewCurrent.name : ''}
        />
        <Button
          className={styles.iconBtn}
          title={saveButtonTooltip}
          onClick={this.save}
          disabled={isSaved}
          status='transparent'
        >
          <SaveIcon className={styles.icon}/>
        </Button>
        <Button
          className={styles.iconBtn}
          title='Add components'
          onClick={this.showSelectionModal}
          status='transparent'
        >
          <AddIcon className={styles.icon}/>
        </Button>
        
        <Button
          className={styles.iconBtn}
          title='Undo'
          onClick={this.props.undo}
          disabled={this.props.undoActionsAvailable === 0}
          status='transparent'
        >
          <UndoIcon className={styles.icon}/>
        </Button>
        <Button
          className={styles.iconBtn}
          title='Redo'
          onClick={this.props.redo}
          disabled={this.props.redoActionsAvailable === 0}
          status='transparent'
        >
          <RedoIcon className={styles.icon}/>
        </Button>
        <Button
          className={styles.iconBtn}
          title='Debug'
          onClick={this.showEditor}
          disabled={this.state.editorVisible}
          status='transparent'
        >
          <DebugIcon className={styles.icon}/>
        </Button>
      </div>
      </div>
    );
  }

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

        { this.state.editorVisible ? (
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
            <div className={styles.rnd}>
              <div className={styles.rndBar}>
                <span className={styles.hidden}/>
                <Button
                  title={this.state.editorChanged ? 'Apply changes in editor to the layout' : 'No changes to apply'}
                  onClick={this.applyEditorLayout}
                  disabled={!this.state.editorChanged}
                >
                  Apply
                </Button>
                <Button onClick={this.hideEditor} title='Close' status='transparent'>
                  &#10005;
                </Button>
              </div>
              <AceEditor
                mode="json"
                className={styles.rndEditor}
                theme="solarized_dark"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.onEditorChange}
                width={'100%'}
                value={this.state.layout}
                editorProps={{ $blockScrolling: true }}
                fontSize={18}
              />
            </div>
          </Rnd>
        ) : null}

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
        {
          ReactDOM.createPortal(this.renderToolbar(), this.toolbar)
        }
      </>
    );
  }
}

export default withRouter(ViewEditor);
