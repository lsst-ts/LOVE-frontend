import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { viewsStates } from '../../redux/reducers/uif';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import NotificationIcon from '../icons/NotificationIcon/NotificationIcon';
import GearIcon from '../icons/GearIcon/GearIcon';
import LogoIcon from '../icons/LogoIcon/LogoIcon';
import NotchCurve from './NotchCurve/NotchCurve';
import styles from './Layout.module.css';

const BREAK_1 = 710;
const BREAK_2 = 630;
const BREAK_3 = 375;

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
      innerWidth: 0,
      collapsedLogo: false,
      viewOnNotch: true,
      sidebarVisible: false,
      settingsVisible: false,
      id: null,
      title: null,
    };
  }

  componentDidUpdate = (prevProps, _prevState) => {
    const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
    if (id && id !== this.state.id) {
      const view = this.props.getCurrentView(id);
      this.setState({ id, title: view ? view.name : null });
    } else if (!id && this.state.id) {
      this.setState({ id: null, title: null });
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

  componentWillMount = () => {
    this.handleResize();
    document.addEventListener('mousedown', this.handleClick, false);
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
    window.removeEventListener('resize', this.handleResize);
  };

  handleClick = (event) => {
    if (this.node && !this.node.contains(event.target)) {
      this.closeMenu();
    }
  };

  handleResize = () => {
    this.setState({
      collapsedLogo: true,
      viewOnNotch: false,
    });
    const innerWidth = window.innerWidth;
    console.log('innerWidth: ', innerWidth);
    this.setState({
      innerWidth: innerWidth,
      collapsedLogo: BREAK_2 < innerWidth && innerWidth <= BREAK_1 || innerWidth <= BREAK_3,
      viewOnNotch: BREAK_2 < innerWidth,
    });
  };

  closeMenu = () => {
    this.setState({ settingsVisible: false });
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

  toggleCollapsedLogo = () => {
    this.setState({ collapsedLogo: !this.state.collapsedLogo });
  };

  toggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  render() {
    return (
      <>
        <div className={[styles.topbar, this.props.token ? null : styles.hidden].join(' ')}>
          <div
            className={[styles.leftNotchContainer, this.state.collapsedLogo ? styles.collapsedLogo : null].join(' ')}
            onClick={this.toggleSidebar}
          >
            <div className={styles.leftTopbar}>
              <LogoIcon className={styles.logo} />
              <span className={styles.divider}> {this.state.title ? '' : ''} </span>
              <span className={styles.text}>
                {this.state.viewOnNotch ? this.state.title : ''}
                {/*{this.state.innerWidth + ' '}*/}
              </span>
            </div>
            <NotchCurve className={styles.notchCurve} />
          </div>

          <div className={styles.middleTopbar} id="customTopbar" />

          <div className={styles.rightNotchContainer}>
            <NotchCurve className={styles.notchCurve} flip="true" />

            <div className={styles.rightTopbar}>
              <Button
                className={styles.iconBtn}
                title="View notifications"
                onClick={() => {}}
                disabled={false}
                status="transparent"
              >
                <NotificationIcon className={styles.icon} />
              </Button>

              <span className={styles.refNode} ref={(node) => (this.node = node)}>
                <Button className={styles.iconBtn} title="Settings" onClick={this.toggleSettings} status="transparent">
                  <GearIcon className={styles.icon} />
                  {this.state.settingsVisible && (
                    <div className={styles.settingsDropdown}>
                      <div
                        className={this.state.id ? styles.menuElement : styles.disabledElement}
                        title="Edit view"
                        onClick={() => {
                          this.editView(this.state.id);
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
                  )}
                </Button>
              </span>
            </div>
          </div>
        </div>

        <div className={[styles.sidebar, !this.state.sidebarVisible ? styles.hidden : null].join(' ')}>
          asdlkhklh
        </div>
        <div className={styles.contentWrapper}>
          {this.props.children}
        </div>

        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
      </>
    );
  }
}

export default withRouter(Layout);
