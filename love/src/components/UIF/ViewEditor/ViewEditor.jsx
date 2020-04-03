import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { Rnd } from 'react-rnd';
import { toast } from 'react-toastify';
import { withRouter, Prompt } from 'react-router-dom';
// import queryString from 'query-string';
import { editViewStates, viewsStates, modes } from '../../../redux/reducers/uif';
import Button from '../../GeneralPurpose/Button/Button';
import Input from '../../GeneralPurpose/Input/Input';
import Modal from '../../GeneralPurpose/Modal/Modal';
import Loader from '../../GeneralPurpose/Loader/Loader';
import CustomView from '../CustomView';
import ComponentSelector from '../ComponentSelector/ComponentSelector';
import html2canvas from 'html2canvas';
import styles from './ViewEditor.module.css';
import customViewStyles from '../CustomView.module.css';
import SaveIcon from '../../icons/SaveIcon/SaveIcon';
import AddIcon from '../../icons/AddIcon/AddIcon';
import UndoIcon from '../../icons/UndoIcon/UndoIcon';
import RedoIcon from '../../icons/RedoIcon/RedoIcon';
import DebugIcon from '../../icons/DebugIcon/DebugIcon';
import ExitModeIcon from '../../icons/ExitModeIcon/ExitModeIcon';
import Select from '../../GeneralPurpose/Select/Select';
import ConfirmationModal from '../../GeneralPurpose/ConfirmationModal/ConfirmationModal';

import { DEVICE_TO_SIZE, DEVICE_TO_COLS } from '../CustomView';

import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import ConfigForm from './ConfigForm';

const deviceOptions = [
  { label: 'Device size', value: Infinity },
  ...Object.entries(DEVICE_TO_SIZE).map(([key, value]) => {
    return { label: key, value: value };
  }),
];

/** RESPONSIVE LAYOUT STATES */

const COLS_NOT_CHANGED = 'COLS_NOT_CHANGED';
const COLS_DECREASED = 'COLS_DECREASED';
const EDIT_NEEDS_CONFIRMATION = 'EDIT_NEEDS_CONFIRMATION';
const COLS_INCREASED = 'COLS_INCREASED';

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
      customViewKey: Math.random(), // To force component reload on config change,
      device: deviceOptions[0],
      deviceToBeConfirmed: null,
      responsiveLayoutState: COLS_NOT_CHANGED,
    };
    this.toolbar = document.createElement('div');
    this.toolbar.className = styles.toolbarContainer;

    this.customViewRef = React.createRef();
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
      if (this.props.loadViewToEdit(id) === undefined && !isNaN(id)) this.props.requestViewToEdit(id);
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

    newLayout.properties.cols = Object.keys(DEVICE_TO_COLS).includes(this.state.device.label)
      ? DEVICE_TO_COLS[this.state.device.label]
      : Object.keys(DEVICE_TO_COLS).reduce((lastMax, key) => {
          return Math.max(lastMax, DEVICE_TO_COLS[key]);
        }, 0);

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
      const elem = { ...parsedLayout.content[key] };
      if (elem.properties.i === elementIndex) elem.config = config;
      parsedLayout.content[key] = elem;
    });
    this.updateEditedViewLayout(parsedLayout);
    this.hideConfigModal();
    this.setState({
      customViewKey: Math.random(),
    });
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

  exitEditMode = (e) => {
    const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);

    this.props.history.push(`/uif/view?id=${id}`);
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
    this.takeScreenshot((thumbnail) => {
      this.props.saveEditedView(thumbnail).then((response) => {
        const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
        if (response && response.id && Number.isNaN(id)) this.props.history.push(`?id=${response.id}`);
      });
    });
  };

  viewIsSaved = () => {
    return this.props.editedViewStatus && this.props.editedViewStatus.code === editViewStates.SAVED;
  };

  onDeviceChange = (device) => {
    const currentCols = isFinite(this.state.device.value)
      ? DEVICE_TO_COLS[this.state.device.label]
      : DEVICE_TO_COLS[Object.keys(DEVICE_TO_COLS)[0]];
    const nextCols = isFinite(device.value)
      ? DEVICE_TO_COLS[device.label]
      : DEVICE_TO_COLS[Object.keys(DEVICE_TO_COLS)[0]];
    const needsConfirmation = currentCols !== nextCols;
    if (needsConfirmation) {
      this.setState({ deviceToBeConfirmed: device, responsiveLayoutState: EDIT_NEEDS_CONFIRMATION});
    } else {
      this.setState({ device });
    }
  };

  confirmDeviceChange = (confirmed) => {
    if (confirmed) {
      this.setState({
        deviceToBeConfirmed: null,
        device: this.state.deviceToBeConfirmed,
        responsiveLayoutState: COLS_NOT_CHANGED,
      });
      return;
    }

    this.setState({
      deviceToBeConfirmed: null,
      responsiveLayoutState: COLS_NOT_CHANGED,
    });
  };
  renderToolbar() {
    const isSaved = this.viewIsSaved();
    const saveButtonTooltip = isSaved ? 'Nothing to save' : 'Save changes';
    return (
      <>
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolbar}>
            <Input
              className={[styles.textField, styles.element].join(' ')}
              defaultValue={this.props.editedViewCurrent ? this.props.editedViewCurrent.name : ''}
              onBlur={this.onNameInputBlur}
              key={this.props.editedViewCurrent ? this.props.editedViewCurrent.name : ''}
            />
            <Select
              small
              option={this.state.device}
              options={deviceOptions}
              onChange={this.onDeviceChange}
              className={[styles.deviceSelect, styles.element].join(' ')}
            />
            <Button
              className={[styles.iconBtn, styles.element].join(' ')}
              title={saveButtonTooltip}
              onClick={this.save}
              disabled={isSaved}
              status="transparent"
            >
              <SaveIcon className={styles.icon} />
            </Button>
            <Button
              className={[styles.iconBtn, styles.element].join(' ')}
              title="Add components"
              onClick={this.showSelectionModal}
              status="transparent"
            >
              <AddIcon className={styles.icon} />
            </Button>

            <Button
              className={[styles.iconBtn, styles.element].join(' ')}
              title="Undo"
              onClick={this.props.undo}
              disabled={this.props.undoActionsAvailable === 0}
              status="transparent"
            >
              <UndoIcon className={styles.icon} />
            </Button>
            <Button
              className={[styles.iconBtn, styles.element].join(' ')}
              title="Redo"
              onClick={this.props.redo}
              disabled={this.props.redoActionsAvailable === 0}
              status="transparent"
            >
              <RedoIcon className={styles.icon} />
            </Button>
            <Button
              className={[styles.iconBtn, styles.element].join(' ')}
              title="Debug"
              onClick={this.showEditor}
              disabled={this.state.editorVisible}
              status="transparent"
            >
              <DebugIcon className={styles.icon} />
            </Button>
            <span className={styles.divider} />

            <Button
              className={[styles.iconBtn].join(' ')}
              title="Exit edit mode"
              onClick={this.exitEditMode}
              disabled={this.state.editorVisible}
              status="transparent"
            >
              <ExitModeIcon className={styles.icon} />
            </Button>
          </div>
        </div>
      </>
    );
  }

  takeScreenshot = (callback) => {
    html2canvas(this.customViewRef.current, {
      allowTaint: true,
      foreignObjectRendering: true,
      backgroundColor: null,
      y: 0,
      x: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      ignoreElements: (el) => {
        return typeof el.className === 'string' && el.className.includes(customViewStyles.editableComponentActions);
      },
    }).then((canvas) => {
      if (canvas.width === 0 || canvas.height === 0) return callback(null);
      const thumbnail = document.createElement('canvas');
      const ctx = thumbnail.getContext('2d');
      const octx = canvas.getContext('2d');
      octx.filter = 'blur(2px)';
      octx.drawImage(canvas, 0, 0);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const size = 1500;
      if (w >= h) {
        thumbnail.width = size;
        thumbnail.height = (size * h) / w;
      } else {
        thumbnail.height = size;
        thumbnail.width = (size * w) / h;
      }
      ctx.drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
      // thumbnail.style = 'position: absolute; top: 0; left: 0;';
      // canvas.style = 'position: absolute; top: 0; left: 0;';
      // document.body.appendChild(thumbnail);
      callback(thumbnail.toDataURL('image/png'));
    });
  };

  makeConfirmationMessage = () => {
    if (!this.state.deviceToBeConfirmed?.value || !this.state.device?.value) {
      return '';
    }

    if (this.state.deviceToBeConfirmed.value < this.state.device.value) {
      return [
        `The canvas space will be limited to a mobile device dimensions.`,
        ` Going back to larger devices will require manual adjustments.`,
        ` Do you want to continue?`,
      ].map((c, index) => <span key={index}>{c}</span>);
    }

    return [
      `The canvas space will be limited to a larger device dimensions.`,
      ` Going back to mobile devices will require manual adjustments.`,
      ` Do you want to continue?`,
    ].map((c, index) => <span key={index}>{c}</span>);
  };

  render() {
    return (
      <>
        <Loader display={this.props.editedViewStatus.code === editViewStates.SAVING} message={'Saving view'} />
        <Prompt
          when={!this.viewIsSaved()}
          message="There are unsaved changes that will be lost. Are you sure you want to leave?"
        />
        <div className={styles.container}>
          <div ref={this.customViewRef}>
            <CustomView
              key={this.state.customViewKey}
              layout={this.getEditedViewLayout()}
              onLayoutChange={this.onLayoutChange}
              onComponentDelete={this.onComponentDelete}
              onComponentConfig={this.onComponentConfig}
              isEditable={true}
              deviceWidth={this.state.device.value}
            ></CustomView>
          </div>
        </div>

        {this.state.editorVisible ? (
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
                <span className={styles.hidden} />
                <Button
                  title={this.state.editorChanged ? 'Apply changes in editor to the layout' : 'No changes to apply'}
                  onClick={this.applyEditorLayout}
                  disabled={!this.state.editorChanged}
                >
                  Apply
                </Button>
                <Button onClick={this.hideEditor} title="Close" status="transparent">
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
        {ReactDOM.createPortal(this.renderToolbar(), this.toolbar)}
        <ConfirmationModal
          // isOpen={!!this.state.deviceToBeConfirmed}
          isOpen={this.state.responsiveLayoutState === EDIT_NEEDS_CONFIRMATION}
          message={this.makeConfirmationMessage()}
          confirmCallback={() => this.confirmDeviceChange(true)}
          cancelCallback={() => this.confirmDeviceChange(false)}
        />
      </>
    );
  }
}

export default withRouter(ViewEditor);
