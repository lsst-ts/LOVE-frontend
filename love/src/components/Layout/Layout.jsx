import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { viewsStates, modes } from '../../redux/reducers/uif';
import { tokenSwapStates } from '../../redux/reducers/auth';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage, relativeTime, takeScreenshot, parseTimestamp, formatTimestamp } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import DropdownMenu from '../GeneralPurpose/DropdownMenu/DropdownMenu';
import NotificationIcon from '../icons/NotificationIcon/NotificationIcon';
import UserIcon from '../icons/UserIcon/UserIcon';
import LogoIcon from '../icons/LogoIcon/LogoIcon';
import MenuIcon from '../icons/MenuIcon/MenuIcon';
import IconBadge from '../icons/IconBadge/IconBadge';
import HeartbeatIcon from '../icons/HeartbeatIcon/HeartbeatIcon';
import NotchCurve from './NotchCurve/NotchCurve';
import EditIcon from '../icons/EditIcon/EditIcon';
import MessageIcon from 'components/icons/MessageIcon/MessageIcon';
import OLEMenu from 'components/OLE/Menu/OLEMenu';
import ClockContainer from '../Time/Clock/Clock.container';
import { HEARTBEAT_COMPONENTS } from '../../Config';
import AlarmAudioContainer from '../Watcher/AlarmAudio/AlarmAudio.container';
import AlarmsList from '../Watcher/AlarmsList/AlarmsList';
import { isAcknowledged, isMuted, isActive } from '../Watcher/AlarmUtils';
import Modal from '../GeneralPurpose/Modal/Modal';
import XMLTable from './XMLTable/XMLTable';
import ConfigPanel from './ConfigPanel/ConfigPanel';
import EmergencyContactsPanel from './EmergencyContactsPanel/EmergencyContactsPanel';
import UserDetails from './UserDetails/UserDetails';
import ObservatorySummaryMenu from 'components/ObservatorySummary/Menu/ObservatorySummaryMenu';
import UserSwapContainer from '../Login/UserSwap.container';
import { severityEnum } from '../../Config';
import ManagerInterface from 'Utils';
import styles from './Layout.module.css';
import ExposureAdd from 'components/OLE/Exposure/ExposureAdd';
import NonExposureEdit from 'components/OLE/NonExposure/NonExposureEdit';

export const LAYOUT_CONTAINER_ID = 'layoutContainer';
const BREAK_1 = 865;
const BREAK_2 = 630;
const BREAK_3 = 375;
const urls = {
  // '/': 'HOME',
  '/uif': 'AVAILABLE VIEWS',
};

class Layout extends Component {
  static propTypes = {
    /** Name of the current user */
    user: PropTypes.string,
    /** Current LOVE configuration */
    config: PropTypes.object,
    /** List of alarms that are displayed */
    alarms: PropTypes.array,
    /** React Router location object */
    location: PropTypes.object,
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
    /** Function to log oput of the app */
    logout: PropTypes.func,
    /** Function to retrieve a view */
    getCurrentView: PropTypes.func,
    /** Function to clear the view to edit (when navigating to create new view) */
    clearViewToEdit: PropTypes.func,
    /** Authentication token */
    token: PropTypes.string,
    /** Mode of the LOVE (EDIT or VIEW) */
    mode: PropTypes.string,
    /** Status of the views request */
    viewsStatus: PropTypes.string,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
    /** Current token swap status */
    tokenSwapStatus: PropTypes.string,
    /** Function to be called when requiring a user swap, similar to a logout */
    requireUserSwap: PropTypes.func,
    /** Function to call in order to reset subscriptions (when the manager heartbeat is missed) */
    resetSubscriptions: PropTypes.func,
  };

  static defaultProps = {
    alarms: [],
    lastSALCommand: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      minSeverityNotification: severityEnum.warning,
      collapsedLogo: false,
      viewOnNotch: true,
      toolbarOverflow: false,
      sidebarVisible: false,
      id: null,
      title: null,
      heartbeatTimer: undefined,
      heartbeatStatus: {},
      heartbeatInfo: {},
      hovered: false, // true if leftTopbar is being hovered
      isXMLModalOpen: false,
      isConfigModalOpen: false,
      isEmergencyContactsModalOpen: false,
      tokenSwapRequested: false,
      isTakingScreenshot: false,
      isLightHidden: true,
      efdStatus: {label: "EFD Healthy status Unknown", style: "invalid"},
      salStatus: {label: "SAL status Unknown", style: "invalid"},
      isNewNonExposureOpen: false,
      isNewExposureOpen: false,
    };

    this.requestToastID = null;
  }

  UNSAFE_componentWillMount = () => {
    this.handleResize();
    document.addEventListener('mousedown', this.handleClick, false);
    window.addEventListener('resize', this.handleResize);
  };

  componentDidMount = () => {
    this.moveCustomTopbar();
    this.props.subscribeToStreams();
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeat();
      this.checkEfdStatus();
    }, 3000);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
    window.removeEventListener('resize', this.handleResize);
    window.clearInterval(this.heartbeatInterval);
    this.props.unsubscribeToStreams();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!isEqual(this.props.config?.content?.alarms, prevProps.config?.content?.alarms)) {
      const minSeverityNotification = this.props.config?.content?.alarms?.minSeverityNotification?.trim().toLowerCase();
      if (!minSeverityNotification || minSeverityNotification === 'mute' || minSeverityNotification === 'muted') {
        // If minSeverityNotification is null or "mute" or "muted", then do not play any sound
        this.setState({ minSeverityNotification: severityEnum.critical + 1 });
      } else {
        this.setState({ minSeverityNotification: severityEnum[minSeverityNotification] });
      }
    }

    if (this.state.toolbarOverflow !== prevState.toolbarOverflow) {
      this.moveCustomTopbar();
    }

    if (this.props.token === null && prevProps.token !== null) {
      this.props.unsubscribeToStreams();
    } else if (this.props.token !== null && prevProps.token === null) {
      this.props.subscribeToStreams();
    }
    const pathname = this.props.location.pathname;
    if (urls[pathname] && this.state.title !== urls[pathname]) {
      this.setState({
        id: null,
        title: urls[pathname],
      });
    } else {
      const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
      if (id && id !== this.state.id && !isNaN(id)) {
        const view = this.props.getCurrentView(id);
        this.setState({ id, title: view ? view.name : null });
      } else if (!id && this.state.id) {
        this.setState({ id: null, title: null });
      }
    }

    if (prevProps.viewsStatus === viewsStates.LOADING && this.props.viewsStatus === viewsStates.LOADED) {
      const view = this.props.getCurrentView(this.state.id);
      this.setState({
        title: view ? view.name : null,
      });
    }

    /* Check command ack for toast*/
    if (
      this.props.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status !== prevProps.lastSALCommand.status
    ) {
      const [message] = getNotificationMessage(this.props.lastSALCommand);
      this.requestToastID = toast.info(message);
    }

    if (
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = getNotificationMessage(this.props.lastSALCommand);
      if (this.requestToastID) {
        toast.dismiss(this.requestToastID);
      }

      if (result === 'Done') {
        toast.success(message);
      } else {
        if (this.props.lastSALCommand.statusCode >= 300) {
          toast.error(`${this.props.lastSALCommand.statusCode}: ${message}`);
        } else {
          toast.info(message);
        }
      }
    }

    const managerKey = HEARTBEAT_COMPONENTS?.MANAGER;
    if (this.state.heartbeatStatus?.[managerKey] === 'alert' && prevState.heartbeatStatus?.[managerKey] !== 'alert') {
      this.props.resetSubscriptions();
    }
  };

  moveCustomTopbar = () => {
    const toolbarParent = document.getElementById(this.state.toolbarOverflow ? 'overflownToolbar' : 'middleTopbar');
    const customTopbar = document.getElementById('customTopbar');
    toolbarParent.appendChild(customTopbar);
  };

  checkHeartbeat = () => {
    const heartbeatInfo = {};
    const heartbeatStatus = {};
    Object.keys(HEARTBEAT_COMPONENTS).forEach((key) => {
      const heartbeatSource = HEARTBEAT_COMPONENTS[key];
      const componentHeartbeat = this.props.getLastComponentHeartbeat(heartbeatSource);
      const lastComponentHeartbeat = this.state.heartbeatInfo[heartbeatSource];
      const componentHeartbeatStatus =
        lastComponentHeartbeat?.data.timestamp !== componentHeartbeat?.data.timestamp
          ? 'ok'
          : componentHeartbeat && !lastComponentHeartbeat
          ? 'ok'
          : 'alert';

      heartbeatInfo[heartbeatSource] = componentHeartbeat;
      heartbeatStatus[heartbeatSource] = componentHeartbeatStatus;
    });
    this.setState({
      heartbeatInfo,
      heartbeatStatus,
    });
  };

  checkEfdStatus = () => {
    const url = this.props.efdConfigFile?.urlStatus;
    const status = ManagerInterface.getEFDStatus(url);
    status.then(result => {
      this.setState({
        efdStatus: result,
      });
    });
  }

  getHeartbeatTitle = (component) => {
    if (component === '') return '';
    const heartbeatSource = HEARTBEAT_COMPONENTS[component];
    const heartbeat = this.state.heartbeatInfo[heartbeatSource];
    if (this.state.heartbeatStatus[component] === 'ok') {
      return `LOVE ${component} heartbeat is being received as expected`;
    }
    if (heartbeat === undefined || heartbeat.data === undefined || heartbeat.data.timestamp === undefined) {
      return `LOVE ${component} heartbeat never seen`;
    }
    const timeStatement = relativeTime(heartbeat.data.timestamp, 0);
    return `LOVE ${component} heartbeat not seen since ${timeStatement}`;
  };

  getObsLocation = () => {
    return(
      'Summit'
    )
  }

  getObsLocationIcon = (style) => {
    var location = this.getObsLocation();

    switch(location){
      case 'Unknown':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 19">
            <path className={style} d="m7,0C3.13,0,0,3.13,0,7s7,12,7,12c0,0,7-8.13,7-12S10.87,0,7,0Zm0,12c-2.76,0-5-2.24-5-5S4.24,2,7,2s5,2.24,5,5-2.24,5-5,5Z"/>
            <path className={style} d="m7,9.52c-.28,0-.5-.22-.5-.5v-1.68c0-.28.22-.5.5-.5.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5,1.5c0,.28-.22.5-.5.5s-.5-.22-.5-.5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5c0,1.21-.86,2.22-2,2.45v1.23c0,.28-.22.5-.5.5Z"/>
            <circle className={style} cx="7" cy="10.6" r=".5"/>
          </svg>
        );
      case 'Tucson':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.84 20">
            <path
              className={style}
              d="m17.84,6.35c-1.1,0-2,.9-2,2v3.8c0,.44-.36.81-.81.81h-1.11V4c0-2.21-1.79-4-4-4s-4,1.79-4,4v4.95h-1.11c-.44,0-.81-.36-.81-.81v-3.8c0-1.1-.9-2-2-2S0,3.24,0,4.35v3.8c0,2.65,2.16,4.81,4.81,4.81h1.11v6.05c0,.55.45,1,1,1h6c.55,0,1-.45,1-1v-2.05h1.11c2.65,0,4.81-2.16,4.81-4.81v-3.8c0-1.1-.9-2-2-2Z"/>
          </svg>
        );
      case 'Base':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.34 20">
            <path className={style} d="m.98,9.77c.13.66.84,1.02,1.47.8l.83-.3C1.78,5.99,3.08,1.64,6.21.5,2.36,1.89.21,5.88.98,9.77Z"/>
            <path className={style} d="m6.02,9.26l5.97-2.17C10.41,2.85,7.84-.1,6.21.5c-1.63.59-1.71,4.51-.19,8.77Z"/>
            <path className={style} d="m16.17,4.24C14.26.76,10.05-.9,6.21.5c3.13-1.14,6.92,1.36,8.52,5.6l.83-.3c.63-.23.94-.97.61-1.55Z"/>
            <path className={style} d="m9.85,12.06h1.14l-2.69-7.38c-.1-.28-.41-.42-.69-.32-.28.1-.42.41-.32.69l2.55,7.02Z"/>
            <path className={style} d="m16.77,12.06h-5.79l1.11,3.06c.1.28-.04.59-.32.69-.06.02-.12.03-.18.03-.22,0-.42-.14-.5-.35l-1.25-3.42h-4.51c-1.11,0-2.06.79-2.26,1.89-.14.77-.6,1.46-1.27,1.88l-.91.58c-.69.44-1.03,1.27-.86,2.06.19.89.99,1.53,1.9,1.53h14.83c.87,0,1.57-.7,1.57-1.57v-4.8c0-.87-.7-1.57-1.57-1.57Zm-13.47,6.32c.03.19.1.37.19.54h-1.54c-.41,0-.77-.29-.86-.69-.08-.36.08-.73.39-.93l.91-.58c.92-.58,1.55-1.53,1.75-2.59.11-.58.62-1.01,1.21-1.01h.71c-.17.27-.3.57-.34.9-.11.76-.5,1.44-1.1,1.92l-.62.5c-.56.45-.82,1.16-.69,1.94Zm4.88-4.26l-.02.23c-.06.6-.31,1.15-.71,1.6l-.54.6c-.38.42-.55.98-.48,1.54l.03.2c.03.23.1.44.2.63h-1.43c-.43,0-.79-.31-.88-.81-.05-.32.07-.64.32-.84l.62-.5c.81-.65,1.34-1.57,1.49-2.6.09-.6.61-1.05,1.22-1.05h.55c-.19.29-.31.62-.35.99Z"/>
          </svg>
        );
      case 'Summit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.12 18.46">
            <path className={style} d="m1.15,17.54l1.61-4.14c.23-.59.94-.75,1.38-.32h0s2.11-6.49,2.11-6.49c.18-.55.51-1.04.95-1.4h0c1.38-1.12,3.37-.68,4.21.93l.76,1.47h0c.53-.19,1.1.09,1.32.64l3.59,9.3c.17.44-.13.92-.58.92H1.73c-.45,0-.75-.48-.58-.92Z"/>
            <path className={style} d="m4.02,2.95l-1.2.35c-.15.06-.15.26,0,.32l1.2.35s.08.05.1.1l.35,1.2c.06.15.26.15.32,0l.35-1.2s.05-.08.1-.1l1.2-.35c.15-.06.15-.26,0-.32l-1.2-.35s-.08-.05-.1-.1l-.35-1.2c-.06-.15-.26-.15-.32,0l-.35,1.2s-.05.08-.1.1Z"/>
            <path className={style} d="m10.21,1.33l-.76.22c-.09.04-.09.17,0,.2l.76.22s.05.03.06.06l.22.76c.04.09.17.09.2,0l.22-.76s.03-.05.06-.06l.76-.22c.09-.04.09-.17,0-.2l-.76-.22s-.05-.03-.06-.06l-.22-.76c-.04-.09-.17-.09-.2,0l-.22.76s-.03.05-.06.06Z"/>
            <circle className={style} cx="2.34" cy="1.05" r="1.05"/>
            <circle className={style} cx="13.83" cy="3.79" r="1.05"/>
            <circle className={style} cx="7.78" cy=".56" r=".52"/>
            <circle className={style} cx=".44" cy="3.43" r=".44"/>
            <circle className={style} cx="15.99" cy="1.74" r=".44"/>
          </svg>
        );
      case 'LSST':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.49 16.74">
            <path className={style} d="m4.18.07L1.11,1.78c-.68.38-1.11,1.14-1.11,1.96v13h5.02V.62c0-.46-.45-.76-.83-.55Z"/>
            <path className={style} d="m17.72,6.04H5.86v10.71h2.69v-2.28h7.26v2.28h2.69V6.81c0-.43-.35-.77-.77-.77Zm-8.86,4.2h-1.31v-2.38h1.31v2.38Zm5.91,0h-5.18v-2.38h5.18v2.38Zm2.04,0h-1.31v-2.38h1.31v2.38Z"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 19">
            <path className={style} d="m7,0C3.13,0,0,3.13,0,7s7,12,7,12c0,0,7-8.13,7-12S10.87,0,7,0Zm0,12c-2.76,0-5-2.24-5-5S4.24,2,7,2s5,2.24,5,5-2.24,5-5,5Z"/>
            <path className={style} d="m7,9.52c-.28,0-.5-.22-.5-.5v-1.68c0-.28.22-.5.5-.5.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5,1.5c0,.28-.22.5-.5.5s-.5-.22-.5-.5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5c0,1.21-.86,2.22-2,2.45v1.23c0,.28-.22.5-.5.5Z"/>
            <circle className={style} cx="7" cy="10.6" r=".5"/>
          </svg>
        );
    }


    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.84 20">
        <path
          className={style}
          d="m17.84,6.35c-1.1,0-2,.9-2,2v3.8c0,.44-.36.81-.81.81h-1.11V4c0-2.21-1.79-4-4-4s-4,1.79-4,4v4.95h-1.11c-.44,0-.81-.36-.81-.81v-3.8c0-1.1-.9-2-2-2S0,3.24,0,4.35v3.8c0,2.65,2.16,4.81,4.81,4.81h1.11v6.05c0,.55.45,1,1,1h6c.55,0,1-.45,1-1v-2.05h1.11c2.65,0,4.81-2.16,4.81-4.81v-3.8c0-1.1-.9-2-2-2Z"/>
      </svg>
    )
  }

  handleClick = (event) => {
    if (
      this.sidebar &&
      !this.sidebar.contains(event.target) &&
      this.leftNotch &&
      !this.leftNotch.contains(event.target)
    ) {
      this.setState({ sidebarVisible: false });
    }
  };

  handleResize = () => {
    this.setState({
      collapsedLogo: true,
      viewOnNotch: false,
      toolbarOverflow: true,
    });
    const innerWidth = window.innerWidth;
    this.setState({
      collapsedLogo: innerWidth <= BREAK_3,
      viewOnNotch: BREAK_2 < innerWidth,
      toolbarOverflow: innerWidth < BREAK_1,
    });
  };

  createNewView = () => {
    this.props.clearViewToEdit();
    this.props.history.push('/uif/view-editor');
  };

  editView = (id) => {
    this.props.history.push('/uif/view-editor?id=' + id);
  };

  navigateTo = (url) => {
    this.setState({ sidebarVisible: false });
    this.props.history.push(url);
  };

  toggleCollapsedLogo = () => {
    this.setState({ collapsedLogo: !this.state.collapsedLogo });
  };

  toggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  goHome = () => {
    this.props.history.push('/');
  };

  setHovered = (value) => {
    this.setState({ hovered: value });
  };

  renderHeartbeatsMenu = () => {
    // const producerHeartbeats = [
    //   HEARTBEAT_COMPONENTS['LOVE:0'],
    //   HEARTBEAT_COMPONENTS['ATDome:0'],
    //   HEARTBEAT_COMPONENTS['ATMCS:0'],
    //   HEARTBEAT_COMPONENTS['Watcher:0'],
    //   HEARTBEAT_COMPONENTS['GenericCamera:0'],
    //   HEARTBEAT_COMPONENTS['ScriptQueue:1'],
    //   HEARTBEAT_COMPONENTS['WeatherStation:1'],
    // ].map((source) => this.state.heartbeatStatus[source]);
    // let producerHeartbeatStatus;
    // if (!producerHeartbeats.every((hb) => hb === undefined)) {
    //   producerHeartbeatStatus = producerHeartbeats.includes('alert') ? 'alert' : 'ok';
    // }

    const summaryHeartbeats = [
      // producerHeartbeatStatus,
      this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.MANAGER],
      this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.COMMANDER],
      this.state.efdStatus.style,
      this.state.salStatus.style,
    ];
    let summaryHeartbeatStatus;
    if (!summaryHeartbeats.every((hb) => hb === undefined)) {
      summaryHeartbeatStatus = summaryHeartbeats.includes('alert') ? 'alert' : 'ok';
    }

    return (
      <DropdownMenu className={styles.settingsDropdown}>
        <Button
          className={[styles.iconBtn, styles.heartbeatButton].join(' ')}
          style={{
            visibility:
              this.props.token && (summaryHeartbeatStatus !== 'ok' || this.state.hovered) ? 'visible' : 'hidden',
          }}
          title={this.getHeartbeatTitle('')}
          onClick={() => {}}
          status="transparent"
        >
          <HeartbeatIcon className={styles.icon} status={summaryHeartbeatStatus} title={this.getHeartbeatTitle('')} />
        </Button>

        <div className={styles.heartbeatsMenu} title="Heartbeats menu">
          <div className={styles.heartbeatMenuElement} title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.MANAGER)}>
            <HeartbeatIcon
              className={styles.icon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.MANAGER]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.MANAGER)}
            />
            <span>LOVE manager</span>
          </div>
          {/** Deprecated: used for old producer version */
          /* <div className={styles.heartbeatMenuElement}>
            <HeartbeatIcon
              className={styles.icon}
             status={producerHeartbeatStatus}
              title={this.getHeartbeatTitle('')}
            />
            <span title={this.getHeartbeatTitle('')}>LOVE producers:</span>
            <HeartbeatIcon
              className={styles.miniIcon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.EVENTS]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.EVENTS)}
            />
            <span title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.EVENTS)} className={styles.heartbeatSubElement}>
              {HEARTBEAT_COMPONENTS.EVENTS}
            </span>
            <HeartbeatIcon
              className={styles.miniIcon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.TELEMETRIES]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.TELEMETRIES)}
            />
            <span
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.TELEMETRIES)}
              className={styles.heartbeatSubElement}
            >
              {HEARTBEAT_COMPONENTS.TELEMETRIES}
            </span>
            <HeartbeatIcon
              className={styles.miniIcon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.HEARTBEATS]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.HEARTBEATS)}
            />
            <span
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.HEARTBEATS)}
              className={styles.heartbeatSubElement}
            >
              {HEARTBEAT_COMPONENTS.HEARTBEATS}
            </span>
            <HeartbeatIcon
              className={styles.miniIcon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.LOVE]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.LOVE)}
            />
            <span title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.LOVE)} className={styles.heartbeatSubElement}>
              {HEARTBEAT_COMPONENTS.LOVE}
            </span>
            <HeartbeatIcon
              className={styles.miniIcon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.SCRIPTQUEUE]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.SCRIPTQUEUE)}
            />
            <span
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.SCRIPTQUEUE)}
              className={styles.heartbeatSubElement}
            >
              {HEARTBEAT_COMPONENTS.SCRIPTQUEUE}
            </span>
          </div> */}
          <div className={styles.heartbeatMenuElement} title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.COMMANDER)}>
            <HeartbeatIcon
              className={styles.icon}
              status={this.state.heartbeatStatus[HEARTBEAT_COMPONENTS.COMMANDER]}
              title={this.getHeartbeatTitle(HEARTBEAT_COMPONENTS.COMMANDER)}
            />
            <span>LOVE commander</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.heartbeatMenuElement} title={this.state.salStatus.label}>
            <HeartbeatIcon
              className={styles.icon}
              status={this.state.salStatus.style}
              title={this.state.salStatus.label}
            />
            <span>SAL status</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.heartbeatMenuElement} title={this.state.efdStatus.label}>
            <HeartbeatIcon
              className={styles.icon}
              status={this.state.efdStatus.style}
              title={this.state.efdStatus.label}
            />
            <span>EFD status</span>
          </div>
        </div>
      </DropdownMenu>
    );
  };

  render() {
    const filteredAlarms = this.props.alarms.filter(
      (a) =>
        isActive(a) && !isAcknowledged(a) && !isMuted(a) && a.severity?.value >= this.state.minSeverityNotification,
    );
    return (
      <>
        <AlarmAudioContainer />
        <div className={styles.hidden}>
          <div id="customTopbar" />
        </div>
        <div
          className={[
            styles.light,
            !this.state.isTakingScreenshot ? styles.lightOff : '',
            this.state.isLightHidden ? styles.lightHidden : '',
          ].join(' ')}
        ></div>
        <div
          className={[styles.topbar, this.props.token ? null : styles.hidden].join(' ')}
          onMouseOver={() => this.setHovered(true)}
          onMouseOut={() => this.setHovered(false)}
        >
          <div
            className={[
              styles.leftNotchContainer,
              this.state.collapsedLogo && !this.state.sidebarVisible ? styles.collapsedLogo : null,
            ].join(' ')}
            ref={(node) => (this.leftNotch = node)}
          >
            <div
              className={[styles.leftTopbar, this.state.collapsedLogo ? styles.leftTopBarNoEditButton : ''].join(' ')}
            >
              <Button
                className={styles.iconBtn}
                title="Toggle menu"
                onClick={this.toggleSidebar}
                disabled={false}
                status="transparent"
              >
                <MenuIcon className={styles.menuIcon} />
              </Button>

              <LogoIcon
                className={styles.logo}
                onClick={this.state.collapsedLogo ? this.toggleSidebar : this.goHome}
                title="Go home"
              />

              {this.state.title && this.state.viewOnNotch && <span className={styles.divider}> | </span>}
              {this.state.viewOnNotch && (
                <>
                  <span className={styles.text}> {this.state.title}</span>

                  {this.props.location.pathname === '/uif/view' && (
                    <Button
                      className={[styles.iconBtn, styles.editButton].join(' ')}
                      title="Edit view"
                      onClick={() => {
                        if (this.state.id) {
                          this.editView(this.state.id);
                        }
                      }}
                      disabled={false}
                      status="transparent"
                      style={{ visibility: this.state.hovered ? 'visible' : 'hidden' }}
                    >
                      <EditIcon className={styles.editIcon} />
                    </Button>
                  )}
                </>
              )}
            </div>
            <NotchCurve className={styles.notchCurve}>asd</NotchCurve>
          </div>

          <div className={styles.middleTopbar}>
            <div id="middleTopbar" />
            <div
              className={[
                styles.clock,
                this.props.mode === modes.EDIT && !this.state.toolbarOverflow ? styles.hidden : '',
              ].join(' ')}
            >
              <ClockContainer timezone="local" hideAnalog hideOffset={true} />
            </div>
          </div>

          <div className={styles.rightNotchContainer}>
            <NotchCurve className={styles.notchCurve} flip="true" />

            <div className={styles.rightTopbar}>
              {this.renderHeartbeatsMenu()}

              <DropdownMenu className={styles.settingsDropdown} disabledToggle={true}>
                <Button className={styles.iconBtn} title="Exposure and Narrative Logs" status="transparent">
                  <MessageIcon className={styles.icon} />
                </Button>
                <div className={styles.userMenu}>
                  {!this.state.isNewNonExposureOpen && !this.state.isNewExposureOpen ? (
                    <OLEMenu
                      newNonExposureClick={() => {
                        this.setState({ isNewNonExposureOpen: true });
                      }}
                      newExposureClick={() => {
                        this.setState({ isNewExposureOpen: true });
                      }}
                    />
                  ) : this.state.isNewNonExposureOpen ? (
                    <>
                      <div className={styles.title}>
                        <span className={styles.bold}>New Narrative Log</span>
                        <span className={styles.floatRight}>
                          <Button
                            status="link"
                            onClick={() => {
                              this.setState({ isNewNonExposureOpen: false });
                            }}
                          >
                            <span className={styles.bold}>{`< Back`}</span>
                          </Button>
                        </span>
                      </div>
                      <div className={styles.divider}></div>
                    </>
                  ) : this.state.isNewExposureOpen ? (
                    <>
                      <div className={styles.title}>
                        <span className={styles.bold}>New Exposure Log</span>
                        <span className={styles.floatRight}>
                          <Button
                            status="link"
                            onClick={() => {
                              this.setState({ isNewExposureOpen: false });
                            }}
                          >
                            <span className={styles.bold}>{`< Back`}</span>
                          </Button>
                        </span>
                      </div>
                      <div className={styles.divider}></div>
                    </>
                  ) : (
                    <></>
                  )}
                  {this.state.isNewNonExposureOpen && <NonExposureEdit isMenu={true} back={() => this.setState({ isNewNonExposureOpen: false })}/>}
                  {this.state.isNewExposureOpen && <ExposureAdd isMenu={true} back={() => this.setState({ isNewExposureOpen: false })} />}
                </div>
              </DropdownMenu>

              <DropdownMenu className={styles.settingsDropdown}>
                <Button className={styles.iconBtn} title="View notifications" onClick={() => {}} status="transparent">
                  <IconBadge content={filteredAlarms.length ?? ''} display={filteredAlarms?.length > 0}>
                    <NotificationIcon className={styles.icon} />
                  </IconBadge>
                </Button>
                <AlarmsList
                  alarms={filteredAlarms}
                  ackAlarm={this.props.ackAlarm}
                  taiToUtc={this.props.taiToUtc}
                  user={this.props.user}
                />
              </DropdownMenu>

              <DropdownMenu className={styles.settingsDropdown}>
                <Button className={styles.iconBtn} title="Settings" status="transparent">
                  {this.getObsLocationIcon((`${styles.icon}`+" "+`${styles.locationIcon}`))}
                </Button>
                <div className={styles.observatorySummaryMenu}>
                  <ObservatorySummaryMenu
                    dividerClassName={styles.divider}
                    locationIcon={this.getObsLocationIcon()}
                    location={this.getObsLocation()}

                    simonyiState={'ENABLED'}
                    simonyiOperationMode={'Calibration'}
                    simonyiTrackingMode={'Sideral Tracking'}
                    simonyiObsMode={'Automatic'}
                    simonyiPower={'Generator G1'}

                    auxtelState={'STANDBY'}
                    auxtelOperationMode={'Science'}
                    auxtelPower={'Generator G1'}
                  ></ObservatorySummaryMenu>
                </div>
              </DropdownMenu>

              <DropdownMenu className={styles.settingsDropdown}>
                <Button className={styles.iconBtn} title="Settings" status="transparent">
                  <UserIcon className={styles.icon} />
                </Button>
                <div className={styles.userMenu}>
                  <UserDetails
                    menuElementClassName={styles.menuElement}
                    dividerClassName={styles.divider}
                    username={this.props.user}
                    execPermission={this.props.execPermission}
                    takeScreenshot={() => {
                      this.setState({ isLightHidden: false }, () => {
                        this.setState({ isTakingScreenshot: true }, () => {
                          setTimeout(() => {
                            this.setState({ isTakingScreenshot: false }, () => {
                              setTimeout(() => {
                                this.setState({ isLightHidden: true }, () => {
                                  takeScreenshot((img) => {
                                    const link = document.createElement('a');
                                    const timestamp = formatTimestamp(parseTimestamp(this.props.timeData?.clock?.tai));
                                    link.href = img;
                                    link.download = `${timestamp}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  });
                                });
                              }, 100);
                            });
                          }, 200);
                        });
                      });
                    }}
                    logout={this.props.logout}
                    requireUserSwap={() => {
                      this.setState({ tokenSwapRequested: true });
                      this.props.requireUserSwap(true);
                    }}
                    onXMLClick={() => this.setState({ isXMLModalOpen: true })}
                    onConfigClick={() => this.setState({ isConfigModalOpen: true })}
                    onEmergencyContactsClick={() => this.setState({ isEmergencyContactsModalOpen: true })}
                  ></UserDetails>
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className={styles.overflownToolbar} id="overflownToolbar" />

        <div
          ref={(node) => (this.sidebar = node)}
          className={[styles.sidebar, !this.state.sidebarVisible ? styles.sidebarHidden : null].join(' ')}
        >
          <div className={styles.viewName}>{!this.state.viewOnNotch ? this.state.title : ' '}</div>
          <div className={[styles.menu, !this.state.viewOnNotch ? styles.showName : null].join(' ')}>
            <p onClick={() => this.navigateTo('/')}>Home</p>
            <p onClick={() => this.navigateTo('/uif')}>Views Index</p>
          </div>
          <div className={styles.sidebarButtons}>
            <Button
              className={[styles.button, this.state.id ? null : styles.hidden].join(' ')}
              title="Edit view"
              onClick={() => {
                if (this.state.id) {
                  this.editView(this.state.id);
                }
              }}
            >
              <span className={styles.label}> Edit this view </span>
              <EditIcon className={styles.editIcon} />
            </Button>

            <Button className={styles.button} title="New view" onClick={this.createNewView}>
              <span className={styles.label}> Create new view </span>
              <span className={styles.plusIcon}> + </span>
            </Button>
          </div>
        </div>

        <div className={styles.contentWrapper} id={LAYOUT_CONTAINER_ID}>
          {this.props.children}
        </div>
        <Modal
          isOpen={this.state.isXMLModalOpen}
          onRequestClose={() => this.setState({ isXMLModalOpen: false })}
          contentLabel="XML versions modal"
        >
          <XMLTable />
        </Modal>
        <Modal
          isOpen={this.state.isConfigModalOpen}
          onRequestClose={() => this.setState({ isConfigModalOpen: false })}
          contentLabel="LOVE Config File modal"
        >
          <ConfigPanel config={this.props.config} setConfig={this.props.setConfig} />
        </Modal>
        <Modal
          isOpen={this.state.isEmergencyContactsModalOpen}
          onRequestClose={() => this.setState({ isEmergencyContactsModalOpen: false })}
          contentLabel="LOVE Emergency contacs modal"
          modalClassName={styles.fixedModalHeight}
        >
          <EmergencyContactsPanel />
        </Modal>
        <Modal
          isOpen={this.state.tokenSwapRequested && this.props.tokenSwapStatus !== tokenSwapStates.RECEIVED}
          onRequestClose={() => {
            this.setState({ tokenSwapRequested: false });
            this.props.requireUserSwap(false);
          }}
          contentLabel="User swap"
          displayFooter={false}
          modalClassName={styles.noMinWidthModal}
        >
          <UserSwapContainer
            tokenStatus={this.props.tokenSwapStatus}
            onFinish={() => {
              this.setState({ tokenSwapRequested: false });
              this.props.requireUserSwap(false);
            }}
          />
        </Modal>
        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
      </>
    );
  }
}

export default withRouter(Layout);
