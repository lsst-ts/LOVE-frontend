/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import isEqual from 'lodash/isEqual';
import CSCExpandedContainer from 'components/CSCSummary/CSCExpanded/CSCExpanded.container';
import RecursiveScriptsTree from './RecursiveScriptsTree/RecursiveScriptsTree';
import WaitingScript from './Scripts/WaitingScript/WaitingScript';
import ScriptList from './Scripts/ScriptList/ScriptList';
import CurrentScript from './Scripts/CurrentScript/CurrentScript';
import FinishedScript from './Scripts/FinishedScript/FinishedScript';
import DraggableScript from './Scripts/DraggableScript/DraggableScript';
import AvailableScript from './Scripts/AvailableScript/AvailableScript';
import styles from './ScriptQueue.module.css';
import Loader from '../GeneralPurpose/Loader/Loader';
import ConfigPanel from './ConfigPanel/ConfigPanel';
import ContextMenu from './Scripts/ContextMenu/ContextMenu';
import RequeueIcon from '../icons/ScriptQueue/RequeueIcon/RequeueIcon';
import TerminateIcon from '../icons/ScriptQueue/TerminateIcon/TerminateIcon';
import MoveToTopIcon from '../icons/ScriptQueue/MoveToTopIcon/MoveToTopIcon';
import MoveToBottomIcon from '../icons/ScriptQueue/MoveToBottomIcon/MoveToBottomIcon';
import { SALCommandStatus } from '../../redux/actions/ws';
import Input from '../GeneralPurpose/Input/Input';
import GlobalState from './GlobalState/GlobalState';
import ScriptDetails from './Scripts/ScriptDetails';
import ScriptConfig from './Scripts/ScriptConfig/ScriptConfig';

const CONFIG_PANEL_INITIAL_WIDTH = 590;

/**
 * Get the hierarchy of scripts and return it in a dictionary.
 * @param {Array} scripts - List of scripts.
 * @returns {Object} - Dictionary with the hierarchy of scripts.
 * @example
 * // returns { root: ['script1', 'script2'], folder1: { root: ['script3', 'script4'] } }
 * getScriptHierarchy([{ path: 'script1' }, { path: 'script2' }, { path: 'folder1/script3' }, { path: 'folder1/script4' }])
 *
 */
const getScriptHierarchy = (scripts) => {
  const mDict = {};
  for (let i = 0; i < scripts.length; i++) {
    const tokens = scripts[i].path.split('/');
    let ref = mDict;
    for (let j = 0; j < tokens.length; j++) {
      if (j === tokens.length - 1) {
        ref['root'] = ref['root'] ?? [];
        ref['root'].push(tokens[j]);
      } else {
        ref[tokens[j]] = ref[tokens[j]] ?? {};
        ref = ref[tokens[j]];
      }
    }
  }
  return mDict;
};

/**
 * Display lists of scripts from the ScriptQueue SAL object. It includes: Available scripts list, Waiting scripts list and Finished scripts list.
 *
 */
export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexedHeartbeats: {},
      isAvailableScriptListVisible: true,
      isFinishedScriptListListVisible: false,
      configPanel: {
        show: false,
        x: 100,
        y: 100,
        configSchema: '',
      },
      state: 'Unknown',
      summaryStateValue: 0,
      useLocalWaitingList: false,
      waitingScriptList: this.props.waitingScriptList,
      isContextMenuOpen: false,
      contextMenuData: {},
      currentMenuSelected: false,
      availableScriptsStandardExpanded: true,
      availableScriptsExternalExpanded: true,
      availableScriptsFilter: '',
      currentScriptDetailState: {
        height: 'initial',
        initialHeight: 350,
      },
      resetButton: <span>Hide details &#9650;</span>,
      scriptsTree: {},
      openTree: {},
    };

    this.observer = null;
    this.scriptQueueContainer = React.createRef();
    this.currentScriptDetailsContainer = React.createRef();
  }

  static defaultProps = {
    summaryStateValue: 0,
    heartbeats: {},
    availableScriptList: [],
    waitingScriptList: [],
    current: 'None',
    finishedScriptList: [],
    state: 'Unknown',
    username: '',
    embedded: false,
  };

  static stateStyleDict = {
    Stopped: 'warning',
    Unknown: 'invalid',
    Running: 'ok',
  };

  static summaryStates = {
    0: {
      name: 'UNKNOWN',
      statusText: 'invalid',
    },
    1: {
      name: 'DISABLED',
      statusText: 'invalid',
    },
    2: {
      name: 'ENABLED',
      statusText: 'ok',
    },
    3: {
      name: 'FAULT',
      statusText: 'alert',
    },
    4: {
      name: 'OFFLINE',
      statusText: 'invalid',
    },
    5: {
      name: 'STANDBY',
      statusText: 'warning',
    },
  };

  componentDidUpdate = (prevProps, _prevState) => {
    if (this.state.currentScriptDetailState !== _prevState.currentScriptDetailState) {
      if (this.state.currentScriptDetailState.height < this.state.currentScriptDetailState.initialHeight) {
        this.setState({ resetButton: <span>Show details &#9660;</span> });
      } else {
        this.setState({ resetButton: <span>Hide details &#9650;</span> });
      }
    }

    if (this.props.availableScriptList && !isEqual(this.props.availableScriptList, prevProps.availableScriptList)) {
      this.props.availableScriptList.sort((a, b) => {
        return a.path.localeCompare(b.path, 'en', { sensitivity: 'base' });
      });

      const filteredScripts = this.props.availableScriptList.filter((script) => {
        if (script.path.toLowerCase().includes(this.state.availableScriptsFilter.toLowerCase())) {
          return true;
        }
        return false;
      });
      const standard = filteredScripts.filter((script) => script.type === 'standard');
      const external = filteredScripts.filter((script) => script.type === 'external');
      const externalTree = getScriptHierarchy(external);
      const standardTree = getScriptHierarchy(standard);
      const scriptsTree = { standard: standardTree, external: externalTree };
      this.setState({ scriptsTree });
    }

    if (this.props.heartbeats !== prevProps.heartbeats) {
      this.setState({
        indexedHeartbeats: this.props.heartbeats.reduce((map, heartbeat) => {
          map[heartbeat.salindex] = heartbeat;
          return map;
        }, {}),
      });
    }
    if (
      this.props.waitingScriptList !== prevProps.waitingScriptList &&
      this.state.draggingScriptInstance === undefined
    ) {
      this.setState({
        useLocalWaitingList: false,
        waitingScriptList: this.props.waitingScriptList,
      });
    }
    /* Check schema from available scripts */

    if (this.state.configPanel.show) {
      const panel = this.state.configPanel;
      const script = this.props.availableScriptList.find(
        (s) => s.type === panel.script.type && s.path === panel.script.path,
      );
      const prevScript = prevProps.availableScriptList.find(
        (s) => s.type === panel.script.type && s.path === panel.script.path,
      );

      /** If the schema was updated, update the state too */
      if (script && script.configSchema !== prevScript.configSchema) {
        this.setState({ configPanel: { ...this.state.configPanel, configSchema: script.configSchema } });
      }
    }
  };

  componentDidMount = () => {
    this.props.subscribeToStreams();

    const debouncedResizeCallback = debounce((entries) => {
      const newHeight = entries[0].target.clientHeight;
      if (newHeight >= this.state.currentScriptDetailState.initialHeight) {
        this.setState((state) => ({
          currentScriptDetailState: {
            ...state.currentScriptDetailState,
            height: state.currentScriptDetailState.initialHeight,
          },
        }));
      } else {
        this.setState((state) => ({
          currentScriptDetailState: {
            ...state.currentScriptDetailState,
            height: newHeight,
          },
        }));
      }
    }, 100);
    this.observer = new ResizeObserver(debouncedResizeCallback);
    if (this.currentScriptDetailsContainer.current) {
      const currentHeight = this.currentScriptDetailsContainer.current.clientHeight;
      this.setState((state) => ({
        currentScriptDetailState: {
          ...state.currentScriptDetailState,
          initialHeight: currentHeight,
          height: this.props.current === 'None' ? 0 : currentHeight,
        },
      }));
      this.observer.observe(this.currentScriptDetailsContainer.current);
    }
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();

    if (this.observer) {
      this.observer.unobserve(this.currentScriptDetailsContainer.current);
    }
  };

  handleResizeButton = () => {
    const { height, initialHeight } = this.state.currentScriptDetailState;
    this.setState((state) => ({
      currentScriptDetailState: {
        ...state.currentScriptDetailState,
        height: height >= initialHeight ? 0 : initialHeight,
      },
    }));
  };

  onShowScriptDetails = (script) => {};

  displayAvailableScripts = () => {
    this.setState({
      isAvailableScriptListVisible: true,
    });
  };

  hideAvailableScripts = () => {
    this.setState({
      isAvailableScriptListVisible: false,
    });
  };

  getScriptFromId = (index) => {
    let list = this.props.waitingScriptList;
    for (let i = 0; i < list.length; i += 1) if (list[i].index === index) return list[i];
    return null;
  };

  onDragStart = (e, draggingId) => {
    if (!this.props.commandExecutePermission) return;
    const draggingScriptInstance = this.getScriptFromId(draggingId);
    this.setState({
      draggingScriptInstance,
      waitingScriptList: this.props.waitingScriptList,
    });
  };

  // eslint-disable-next-line
  onDragEnd = (e, draggingId) => {
    if (!this.props.commandExecutePermission) return;
    this.setState({
      draggingScriptInstance: undefined,
    });
    let i = 0;
    for (; i < this.state.waitingScriptList.length; ++i)
      if (this.state.waitingScriptList[i].index === draggingId) break;
    this.moveScript(draggingId, i);
  };

  onDragEnter = () => {
    if (!this.props.commandExecutePermission) return;
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;

    const waitingList = [...this.props.waitingScriptList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
    }

    if (waitingListSourceId === -1) {
      waitingList.splice(0, 0, this.state.draggingScriptInstance);
      this.setState({
        waitingScriptList: [...waitingList],
      });
    }
  };

  // eslint-disable-next-line
  onDragOver = (e, targetScriptId, source) => {
    if (!this.props.commandExecutePermission) return;
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;
    if (targetScriptId === sourceScriptId) return;
    const waitingList = [...this.state.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;
    let waitingListTargetId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
      if (waitingList[i].index === targetScriptId) waitingListTargetId = i;
    }

    newWaitingList.splice(waitingListSourceId, 1);
    newWaitingList.splice(waitingListTargetId, 0, waitingList[waitingListSourceId]);

    this.setState({
      waitingScriptList: newWaitingList,
      useLocalWaitingList: true,
    });
  };

  openFinishedList = () => {
    this.setState({
      isFinishedScriptListListVisible: true,
    });
  };

  closeFinishedList = () => {
    this.setState({
      isFinishedScriptListListVisible: false,
    });
  };

  openAvailableList = () => {
    this.setState({
      isAvailableScriptListVisible: true,
    });
  };

  closeAvailableList = () => {
    this.setState({
      isAvailableScriptListVisible: false,
    });
  };

  launchScriptConfig = (e, script) => {
    let { x } = e.target.getBoundingClientRect();
    const scriptQueueContainer = this.scriptQueueContainer.current;
    if (scriptQueueContainer) {
      x = scriptQueueContainer.getBoundingClientRect().width / 2 - CONFIG_PANEL_INITIAL_WIDTH / 2;
    }
    this.setState({
      configPanel: {
        script,
        name: script.name,
        show: true,
        x,
        y: 100,
        configSchema: script.configSchema,
      },
    });
  };

  launchScript = (isStandard, path, config, descr, location, pauseCheckpoint, stopCheckpoint, logLevel) => {
    const user = this.props.username;
    const newDescription = `${descr}\n\n-------\nSent by ${user}`;
    this.props.requestSALCommand({
      cmd: 'cmd_add',
      params: {
        isStandard,
        path,
        config,
        descr: newDescription,
        location,
        pauseCheckpoint,
        stopCheckpoint,
        logLevel,
      },
      component: 'ScriptQueue',
    });
    this.closeConfigPanel();
  };

  reloadSchema = (path, isStandard, callback) => {
    const payload = {
      component: 'ScriptQueue',
      salindex: this.props.salindex,
      cmd: 'cmd_showSchema',
      params: {
        path,
        isStandard,
      },
    };
    this.props.requestSALCommand(payload, callback);
  };

  closeConfigPanel = () => {
    this.setState({
      configPanel: {
        show: false,
        x: 0,
        y: 0,
      },
    });
  };

  stopScript = (scriptIndex, terminate = false) => {
    const array = new Array(400).fill(0);
    array[0] = scriptIndex;
    this.props.requestSALCommand({
      cmd: 'cmd_stopScripts',
      params: {
        length: 1,
        salIndices: array,
        terminate: terminate,
      },
    });
  };

  resumeScript = (scriptIndex) => {
    const array = new Array(400).fill(0);
    array[0] = scriptIndex;
    this.props.requestSALCommand({
      csc: 'Script',
      salindex: 0,
      cmd: 'cmd_resume',
      params: {},
    });
  };

  requeueScript = (scriptIndex) => {
    this.props.requestSALCommand({
      cmd: 'cmd_requeue',
      params: {
        scriptSalIndex: scriptIndex,
        location: 2,
      },
    });
  };

  moveScript = (scriptIndex, position, offset = true) => {
    let location = 3; //Before reference script
    let locationSalIndex = 0;
    const offsetValue = offset || position <= 0 ? 1 : 0;
    if (position <= 0) location = 1; //Location: first
    //Location: last
    if (position >= this.state.waitingScriptList.length - 1) location = 2;
    else {
      locationSalIndex = this.state.waitingScriptList[position + offsetValue].index;
    }
    this.props.requestSALCommand({
      cmd: 'cmd_move',
      params: {
        scriptSalIndex: scriptIndex,
        location: location,
        locationSalIndex: locationSalIndex,
      },
    });
  };

  pauseScriptQueue = () => {
    this.props.requestSALCommand({
      cmd: 'cmd_pause',
      params: {},
    });
  };

  resumeScriptQueue = () => {
    this.props.requestSALCommand({
      cmd: 'cmd_resume',
      params: {},
    });
  };

  summaryStateCommand = (commandName) => {
    if (!['start', 'enable', 'disable', 'standby'].includes(commandName)) {
      return;
    }

    this.props.requestSALCommand({
      cmd: `cmd_${commandName}`,
      params: {},
    });
  };
  onClickContextMenu = (event, index, currentMenuSelected = false) => {
    event.stopPropagation();
    this.setState({ isContextMenuOpen: !this.state.isContextMenuOpen });
    this.setState({
      contextMenuData: event.target.getBoundingClientRect(),
      selectedScriptIndex: index,
      currentMenuSelected: currentMenuSelected,
    });
  };

  requeueSelectedScript = () => {
    this.requeueScript(this.state.selectedScriptIndex);
  };

  stopSelectedScript = (terminate = false) => {
    this.stopScript(this.state.selectedScriptIndex, terminate);
    this.setState({ isContextMenuOpen: false });
  };

  moveScriptUp = (scriptIndex) => {
    let i = 0;
    for (; i < this.props.waitingScriptList.length; i++)
      if (this.props.waitingScriptList[i].index === scriptIndex) break;
    this.moveScript(scriptIndex, i - 1, false);
  };

  moveScriptDown = (scriptIndex) => {
    let i = 0;
    for (; i < this.props.waitingScriptList.length; i++)
      if (this.props.waitingScriptList[i].index === scriptIndex) break;
    this.moveScript(scriptIndex, i + 1, true);
  };

  moveSelectedScriptToTop = () => {
    this.moveScript(this.state.selectedScriptIndex, 0);
    this.setState({ isContextMenuOpen: false });
  };

  moveSelectedScriptToBottom = () => {
    this.moveScript(this.state.selectedScriptIndex, Infinity);
    this.setState({ isContextMenuOpen: false });
  };

  renderAvailableScript = (script) => {
    if (!script) return null;
    return (
      <DraggableScript
        key={`dragging-available-${script.type}-${script.path}`}
        {...script}
        dragSourceList="available"
        onDragStart={(e, id) => this.onDragStart(e, id, 'available')}
        onDragEnd={(e, id) => this.onDragEnd(e, id, 'available')}
        draggingScriptInstance={this.state.draggingScriptInstance}
        disabled={true}
      >
        <AvailableScript
          key={`${script.type}-${script.path}`}
          path={script.path}
          isStandard={script.type ? script.type.toLowerCase() === 'standard' : true}
          launchScriptConfig={this.launchScriptConfig}
          script={script}
          commandExecutePermission={this.props.commandExecutePermission}
          {...script}
        />
      </DraggableScript>
    );
  };

  toggleAvailableScriptsExpanded = (scriptType) => {
    if (scriptType === 'standard') {
      this.setState({
        availableScriptsStandardExpanded: !this.state.availableScriptsStandardExpanded,
      });
    }
    if (scriptType === 'external') {
      this.setState({
        availableScriptsExternalExpanded: !this.state.availableScriptsExternalExpanded,
      });
    }
  };

  onAvailableScriptsFilterChange = (e) => {
    this.setState({
      availableScriptsFilter: e.target.value,
    });
  };

  setOpenTree = (openTree) => {
    this.setState({ openTree });
  };

  render() {
    const finishedScriptListClass = this.state.isFinishedScriptListListVisible ? '' : styles.collapsedScriptList;
    const availableScriptListClass = this.state.isAvailableScriptListVisible ? '' : styles.collapsedScriptList;
    const current = this.props.current === 'None' ? {} : { ...this.props.current };
    const waitingList = this.state.useLocalWaitingList ? this.state.waitingScriptList : this.props.waitingScriptList;

    const totalWaitingSeconds = waitingList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);

    const totalFinishedSeconds = this.props.finishedScriptList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);
    const currentContextMenu = [
      { icon: <TerminateIcon />, text: 'Terminate', action: () => this.stopSelectedScript(true) },
      { icon: <RequeueIcon />, text: 'Requeue', action: this.requeueSelectedScript },
    ];
    const waitingContextMenu = [
      { icon: <MoveToTopIcon />, text: 'Move to top', action: this.moveSelectedScriptToTop },
      { icon: <MoveToBottomIcon />, text: 'Move to bottom', action: this.moveSelectedScriptToBottom },
      { icon: <RequeueIcon />, text: 'Requeue', action: this.requeueSelectedScript },
    ];

    const contextMenuOption = this.state.currentMenuSelected ? currentContextMenu : waitingContextMenu;

    const filteredAvailableScripts = this.props.availableScriptList.filter((script) => {
      if (!this.state.availableScriptsFilter) return true;
      return script.path.toLowerCase().includes(this.state.availableScriptsFilter.toLowerCase());
    });

    return (
      <div
        id="container"
        ref={this.scriptQueueContainer}
        onClick={(e) => {
          this.setState({ isContextMenuOpen: false });
        }}
        onScroll={() => {
          this.setState({ isContextMenuOpen: false });
        }}
        className={[styles.scriptQueueContainer, styles.threeColumns, this.props.embedded ? styles.embedded : ''].join(
          ' ',
        )}
      >
        <Loader
          display={
            this.props.lastSALCommand.component === 'ScriptQueue' &&
            this.props.lastSALCommand.status === SALCommandStatus.REQUESTED
          }
          message={`Running command: ${this.props.lastSALCommand.cmd}`}
        />
        <ConfigPanel
          launchScript={this.launchScript}
          closeConfigPanel={this.closeConfigPanel}
          reloadSchema={this.reloadSchema}
          configPanel={this.state.configPanel}
        />
        <ContextMenu
          isOpen={this.state.isContextMenuOpen}
          contextMenuData={this.state.contextMenuData}
          options={contextMenuOption}
        />

        <GlobalState
          summaryState={ScriptQueue.summaryStates[this.props.summaryStateValue]}
          queueState={{
            statusText: ScriptQueue.stateStyleDict[this.props.state],
            name: this.props.state,
          }}
          requestSummaryStateCommand={this.summaryStateCommand}
          commandExecutePermission={this.props.commandExecutePermission}
          resumeScriptQueue={this.resumeScriptQueue}
          pauseScriptQueue={this.pauseScriptQueue}
        />

        <div className={styles.currentScriptWrapper}>
          <div className={styles.currentScriptContainerWrapper}>
            <div className={styles.currentScriptContainer}>
              <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
              <CurrentScript
                {...current}
                index={current.index}
                scriptState={current.script_state}
                processState={current.process_state}
                isStandard={current.type ? current.type.toUpperCase() === 'STANDARD' : undefined}
                estimatedTime={current.expected_duration}
                heartbeatData={this.state.indexedHeartbeats[current.index]}
                timestampRunStart={current.timestampRunStart}
                stopScript={this.stopScript}
                pauseScript={this.pauseScript}
                onClickContextMenu={this.onClickContextMenu}
                commandExecutePermission={this.props.commandExecutePermission}
                resumeScript={this.resumeScript}
                onClick={() => null}
              />
            </div>
          </div>
        </div>

        <div className={styles.currentScriptDetailsWrapper}>
          <div className={styles.currentScriptResetSize} onClick={this.handleResizeButton}>
            {this.state.resetButton}
          </div>
          <div
            style={{
              height: this.state.currentScriptDetailState.height,
              maxHeight: this.state.currentScriptDetailState.initialHeight,
            }}
            className={styles.currentScriptDetails}
            ref={this.currentScriptDetailsContainer}
          >
            <div className={styles.currentScriptDescription}>
              <ScriptConfig {...current} />
              <ScriptDetails {...current} />
            </div>
            <div className={styles.currentScriptLogs}>
              <CSCExpandedContainer
                group={''}
                name={'Script'}
                salindex={current.index ?? 0}
                onCSCClick={() => null}
                displaySummaryState={false}
                hideTitle={true}
              />
            </div>
          </div>
        </div>

        {/* LISTS BODY */}
        <div className={styles.listsBody}>
          <div className={[styles.collapsableScriptList, availableScriptListClass].join(' ')}>
            <div className={[styles.availableScriptList, styles.scriptList].join(' ')}>
              <div
                className={[styles.collapsedScriptListLabelWrapper].join(' ')}
                onClick={this.openAvailableList}
                title="Open available script list"
              >
                <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
              </div>
              <div className={styles.collapsableScriptListContent}>
                <div className={styles.listTitleWrapper}>
                  <div className={styles.listTitleLeft}>
                    <span className={styles.listTitle}>
                      AVAILABLE SCRIPTS ({this.props.availableScriptList.length})
                    </span>
                    <span className={styles.listSubtitle}>
                      Filter:{' '}
                      <Input onChange={this.onAvailableScriptsFilterChange} className={styles.availableScriptsInput} />
                    </span>
                  </div>
                  <div
                    className={styles.collapseScriptListButton}
                    onClick={this.closeAvailableList}
                    title="Close available script list"
                  >
                    <span style={{ width: '100%' }}>&#8854;</span>
                  </div>
                </div>
                <ScriptList noOverflow={true}>
                  {this.state.availableScriptsFilter !== '' ? (
                    <div
                      className={[
                        styles.standardScriptsContainer,
                        this.state.availableScriptsStandardExpanded ? '' : styles.availableListCollapsed,
                      ].join(' ')}
                    >
                      {this.props.availableScriptList.map((script) => {
                        if (!script.path.toLowerCase().includes(this.state.availableScriptsFilter.toLowerCase()))
                          return null;
                        return this.renderAvailableScript(script);
                      })}
                    </div>
                  ) : (
                    <>
                      <div className={styles.standardExternalContainer}>
                        <div
                          className={[
                            styles.standardScriptsContainer,
                            this.state.availableScriptsStandardExpanded ? '' : styles.availableListCollapsed,
                          ].join(' ')}
                        >
                          <RecursiveScriptsTree
                            availableScriptList={filteredAvailableScripts}
                            category="standard"
                            scriptsTree={this.state.scriptsTree.standard}
                            launchScriptConfig={this.launchScriptConfig}
                            scriptsBlocked={this.props.commandExecutePermission}
                            openTree={this.state.openTree}
                            setOpenTree={this.setOpenTree}
                          />
                        </div>
                        <div
                          className={[
                            styles.externalScriptsContainer,
                            this.state.availableScriptsExternalExpanded ? '' : styles.availableListCollapsed,
                          ].join(' ')}
                        >
                          <RecursiveScriptsTree
                            availableScriptList={filteredAvailableScripts}
                            category="external"
                            scriptsTree={this.state.scriptsTree.external}
                            launchScriptConfig={this.launchScriptConfig}
                            scriptsBlocked={this.props.commandExecutePermission}
                            openTree={this.state.openTree}
                            setOpenTree={this.setOpenTree}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </ScriptList>
              </div>
            </div>
          </div>

          <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
            <div className={styles.listTitleWrapper}>
              <div className={styles.listTitleLeft}>
                <span className={styles.listTitle}>WAITING SCRIPTS ({waitingList.length})</span>
                <span className={styles.listSubtitle}>
                  Total time:{' '}
                  {Math.trunc(totalWaitingSeconds / 3600) > 0 ? `${Math.trunc(totalWaitingSeconds / 3600)}h ` : ''}
                  {Math.trunc(totalWaitingSeconds / 60) > 0
                    ? `${Math.trunc(totalWaitingSeconds / 60 - Math.trunc(totalWaitingSeconds / 3600) * 60)}m `
                    : ''}
                  {`${(totalWaitingSeconds - Math.trunc(totalWaitingSeconds / 60) * 60).toFixed(2)}s`}
                </span>
              </div>
            </div>
            <ScriptList onDragEnter={this.onDragEnter}>
              {waitingList.map((script, listIndex) => {
                if (!script) return null;
                const estimatedTime = script.expected_duration === 'UNKNOWN' ? 0 : parseFloat(script.expected_duration);

                const isStandard =
                  !script.type || script.type === 'UNKNOWN' ? undefined : script.type.toLowerCase() === 'standard';

                const key = script.index ? script.index : `unknown-${listIndex}`;
                return (
                  <DraggableScript
                    key={`dragging-waiting-${key}`}
                    {...script}
                    onDragOver={(e, id) => this.onDragOver(e, id, 'waiting')}
                    onDragStart={(e, id) => this.onDragStart(e, id, 'waiting')}
                    onDragEnd={(e, id) => this.onDragEnd(e, id, 'waiting')}
                    draggingScriptInstance={this.state.draggingScriptInstance}
                    disabled={!this.props.commandExecutePermission}
                  >
                    <div style={{ userSelect: 'text' }}>
                      <WaitingScript
                        isCompact={
                          this.state.isAvailableScriptListVisible && this.state.isFinishedScriptListListVisible
                        }
                        path={script.path}
                        isStandard={isStandard}
                        estimatedTime={estimatedTime}
                        heartbeatData={this.state.indexedHeartbeats[script.index]}
                        stopScript={this.stopScript}
                        moveScript={this.moveScript}
                        onClickContextMenu={this.onClickContextMenu}
                        moveScriptUp={this.moveScriptUp}
                        moveScriptDown={this.moveScriptDown}
                        commandExecutePermission={this.props.commandExecutePermission}
                        {...script}
                        onClick={() => this.onShowScriptDetails(script)}
                      />
                    </div>
                  </DraggableScript>
                );
              })}
            </ScriptList>
          </div>

          <div className={[styles.collapsableScriptList, finishedScriptListClass].join(' ')}>
            <div className={[styles.finishedScriptList, styles.scriptList].join(' ')}>
              <div
                className={[styles.collapsedScriptListLabelWrapper].join(' ')}
                onClick={this.openFinishedList}
                title="Open finished script list"
              >
                <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
              </div>
              <div className={styles.collapsableScriptListContent}>
                <div className={styles.listTitleWrapper}>
                  <div className={styles.listTitleLeft}>
                    <span className={styles.listTitle}>FINISHED SCRIPTS ({this.props.finishedScriptList.length})</span>
                    <span className={styles.listSubtitle}>
                      Total time:{' '}
                      {Math.trunc(totalFinishedSeconds / 3600) > 0
                        ? `${Math.trunc(totalFinishedSeconds / 3600)}h `
                        : ''}
                      {Math.trunc(totalFinishedSeconds / 60) > 0
                        ? `${Math.trunc(totalFinishedSeconds / 60 - Math.trunc(totalFinishedSeconds / 3600) * 60)}m `
                        : ''}
                      {`${(totalFinishedSeconds - Math.trunc(totalFinishedSeconds / 60) * 60).toFixed(2)}s`}
                    </span>
                  </div>
                  <div
                    className={styles.collapseScriptListButton}
                    onClick={this.closeFinishedList}
                    title="Close finished script list"
                  >
                    <span style={{ width: '100%' }}>&#8854;</span>
                  </div>
                </div>
                <ScriptList>
                  {this.props.finishedScriptList.map((script, listIndex) => {
                    const isStandard =
                      !script.type || script.type === 'UNKNOWN' ? true : script.type.toLowerCase() === 'standard';
                    const estimatedTime = script.expected_duration === 'UNKNOWN' ? -1 : script.expected_duration;
                    const key = script.index ? script.index : `unknown-${listIndex}`;
                    const elapsedTime =
                      script.timestampProcessEnd === 0.0 || script.timestampRunStart === 0.0
                        ? 0.0
                        : script.timestampProcessEnd - script.timestampRunStart;
                    return (
                      <DraggableScript key={`dragging-finished-${key}`} dragSourceList="available" disabled>
                        <div style={{ userSelect: 'text' }}>
                          <FinishedScript
                            {...script}
                            path={script.path}
                            isStandard={isStandard}
                            estimatedTime={estimatedTime}
                            elapsedTime={elapsedTime}
                            isCompact={
                              this.state.isAvailableScriptListVisible && this.state.isFinishedScriptListListVisible
                            }
                            requeueScript={this.requeueScript}
                            commandExecutePermission={this.props.commandExecutePermission}
                            onClick={() => this.onShowScriptDetails(script)}
                          />
                        </div>
                      </DraggableScript>
                    );
                  })}
                </ScriptList>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
