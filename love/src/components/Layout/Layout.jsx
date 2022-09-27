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
import UserSwapContainer from '../Login/UserSwap.container';
import { severityEnum } from '../../Config';
import ManagerInterface from 'Utils';
import styles from './Layout.module.css';

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
      const minSeverityNotification = this.props.config.content.alarms.minSeverityNotification?.trim().toLowerCase();
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
