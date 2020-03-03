import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { viewsStates } from '../../redux/reducers/uif';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage, relativeTime } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import NotificationIcon from '../icons/NotificationIcon/NotificationIcon';
import GearIcon from '../icons/GearIcon/GearIcon';
import LogoIcon from '../icons/LogoIcon/LogoIcon';
import MenuIcon from '../icons/MenuIcon/MenuIcon';
import HeartbeatIcon from '../icons/HeartbeatIcon/HeartbeatIcon';
import NotchCurve from './NotchCurve/NotchCurve';
import GoBackIcon from '../icons/GoBackIcon/GoBackIcon';
import EditIcon from '../icons/EditIcon/EditIcon';
import styles from './Layout.module.css';

const BREAK_1 = 710;
const BREAK_2 = 630;
const BREAK_3 = 375;
const urls = {
  // '/': 'HOME',
  '/uif': 'AVAILABLE VIEWS',
};

class Layout extends Component {
  static propTypes = {
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
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsedLogo: false,
      viewOnNotch: true,
      sidebarVisible: false,
      settingsVisible: false,
      id: null,
      title: null,
      heartbeatTimer: undefined,
      lastHeartbeat: undefined,
      hovered: false, // true if leftTopbar is being hovered
    };
  }

  componentWillMount = () => {
    this.handleResize();
    document.addEventListener('mousedown', this.handleClick, false);
    window.addEventListener('resize', this.handleResize);
  };

  componentDidMount = () => {
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeat();
    }, 3000);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
    window.removeEventListener('resize', this.handleResize);
    window.clearInterval(this.heartbeatInterval);
  };

  componentDidUpdate = (prevProps, _prevState) => {
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
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = getNotificationMessage(this.props.lastSALCommand);
      if (result === 'Done') {
        toast.success(message);
      } else {
        toast.info(message);
      }
    }
  };

  checkHeartbeat = () => {
    const lastManagerHeartbeat = this.props.getLastManagerHeartbeat();
    const heartbeatStatus =
      this.state.lastHeartbeat &&
      lastManagerHeartbeat &&
      this.state.lastHeartbeat.data.timestamp !== lastManagerHeartbeat.data.timestamp
        ? 'ok'
        : 'alert';
    this.setState({
      lastHeartbeat: lastManagerHeartbeat,
      heartbeatStatus,
    });
  };

  getHeartbeatTitle = (heartbeat) => {
    if (heartbeat === undefined || heartbeat.data === undefined || heartbeat.data.timestamp === undefined) {
      return 'LOVE manager heartbeat never seen';
    }
    const timeStatement = relativeTime(heartbeat.data.timestamp, 0);
    return `LOVE manager heartbeat not seen since ${timeStatement}`;
  };

  handleClick = (event) => {
    if (this.dropdown && !this.dropdown.contains(event.target)) {
      this.setState({ settingsVisible: false });
    }
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
    });
    const innerWidth = window.innerWidth;
    this.setState({
      collapsedLogo: (BREAK_2 < innerWidth && innerWidth <= BREAK_1) || innerWidth <= BREAK_3,
      viewOnNotch: BREAK_2 < innerWidth,
    });
  };

  toggleSettings = () => {
    this.setState({ settingsVisible: !this.state.settingsVisible });
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

  goBack = () => {
    this.props.history.goBack();
  };

  setHovered = (value) => {
    this.setState({ hovered: value });
  };
  render() {
    return (
      <>
        <div className={[styles.topbar, this.props.token ? null : styles.hidden].join(' ')}>
          <div
            className={[
              styles.leftNotchContainer,
              this.state.collapsedLogo && !this.state.sidebarVisible ? styles.collapsedLogo : null,
            ].join(' ')}
            ref={(node) => (this.leftNotch = node)}
            // onClick={this.toggleSidebar}
            onMouseOver={() => this.setHovered(true)}
            onMouseOut={() => this.setHovered(false)}
          >
            <div
              className={[styles.leftTopbar, this.state.collapsedLogo ? styles.leftTopBarNoEditButton : ''].join(' ')}
            >
              <Button
                className={styles.iconBtn}
                title="Edit view"
                onClick={this.toggleSidebar}
                disabled={false}
                status="transparent"
              >
                <MenuIcon className={styles.logo} />
              </Button>

              <LogoIcon
                className={styles.logo}
                onClick={this.state.collapsedLogo ? this.toggleSidebar : this.goHome}
                title="Go home"
              />

              {this.state.title && this.state.viewOnNotch && <span className={styles.divider}> '|' </span>}
              {this.state.title && this.state.viewOnNotch && (
                <GoBackIcon className={styles.logo} onClick={this.goBack} title="Go back" />
              )}
              {this.state.viewOnNotch && (
                <span className={styles.text}>
                  {
                    <>
                      <span className={styles.textContent}> {this.state.title}</span>

                      {this.props.location.pathname.includes('uif/view') && (
                        <Button
                          className={[styles.editButton].join(' ')}
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
                          <EditIcon className={styles.logo} />
                        </Button>
                      )}
                    </>
                  }
                </span>
              )}
            </div>
            <NotchCurve className={styles.notchCurve}>asd</NotchCurve>
          </div>

          <div className={styles.middleTopbar} id="customTopbar" />

          <div className={styles.rightNotchContainer}>
            <NotchCurve className={styles.notchCurve} flip="true" />

            <div className={styles.rightTopbar}>
              {this.state.heartbeatStatus !== 'ok' && (
                <div className={styles.heartbeatIconWrapper}>
                  <HeartbeatIcon
                    status={this.state.heartbeatStatus}
                    title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                  />
                </div>
              )}
              <Button
                className={styles.iconBtn}
                title="View notifications"
                onClick={() => {}}
                disabled={false}
                status="transparent"
              >
                <NotificationIcon className={styles.icon} />
              </Button>

              <span className={styles.refNode} ref={(node) => (this.dropdown = node)}>
                <Button className={styles.iconBtn} title="Settings" onClick={this.toggleSettings} status="transparent">
                  <GearIcon className={styles.icon} />
                  <div
                    className={[styles.settingsDropdown, this.state.settingsVisible ? styles.settingsVisible : ''].join(
                      ' ',
                    )}
                  >
                    <div
                      className={this.state.id ? styles.menuElement : styles.disabledElement}
                      title="Edit view"
                      onClick={() => {
                        if (this.state.id) {
                          this.editView(this.state.id);
                        }
                      }}
                    >
                      Edit view
                    </div>
                    <div className={styles.menuElement} title="New view" onClick={this.createNewView}>
                      Create new View
                    </div>
                    <span className={styles.divider} />
                    <div className={styles.menuElement} title="Logout" onClick={this.props.logout}>
                      Logout
                    </div>
                  </div>
                </Button>
              </span>
            </div>
          </div>
        </div>

        <div
          ref={(node) => (this.sidebar = node)}
          className={[styles.sidebar, !this.state.sidebarVisible ? styles.sidebarHidden : null].join(' ')}
        >
          <div className={styles.viewName}>{!this.state.viewOnNotch ? this.state.title : ' '}</div>
          <div className={[styles.menu, !this.state.viewOnNotch ? styles.showName : null].join(' ')}>
            <p onClick={() => this.navigateTo('/')}>Home</p>
            <p onClick={() => this.navigateTo('/uif')}>Views Index</p>
          </div>
        </div>

        <div className={styles.contentWrapper}>{this.props.children}</div>

        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
      </>
    );
  }
}

export default withRouter(Layout);
