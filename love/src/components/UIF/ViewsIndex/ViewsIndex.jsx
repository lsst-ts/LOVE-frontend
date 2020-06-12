import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Input from '../../GeneralPurpose/Input/Input';
import ConfirmationModal from '../../GeneralPurpose/ConfirmationModal/ConfirmationModal';
import ViewLauncher from './ViewLauncher/ViewLauncher';
import ManagerInterface from '../../../Utils';

import styles from './ViewsIndex.module.css';
import viewLauncherStyles from './ViewLauncher/ViewLauncher.module.css';

class ViewsIndex extends Component {
  static propTypes = {
    /** React Router history object */
    history: PropTypes.object,
    /** Current views to display */
    views: PropTypes.array,
    /** Function to delete a view */
    deleteView: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      hoveredView: null,
      viewToDelete: null,
    };
  }

  createNewView = () => {
    this.props.history.push('/uif/view-editor');
  };

  editView = (id) => {
    this.props.history.push('/uif/view-editor?id=' + id);
  };

  openView = (id) => {
    this.props.history.push('/uif/view?id=' + id);
  };

  changeViewToDelete = (view) => {
    this.setState({ viewToDelete: view });
  };

  deleteView = (id) => {
    this.changeViewToDelete(null);
    this.props.deleteView(id).then((success) => {
      if (success) {
        toast.success('View deleted successfully');
      } else {
        toast.error('View deletion failed');
      }
    });
  };

  changeFilter = (e) => {
    const newValue = e.target.value;
    this.setState({
      filter: newValue,
    });
  };

  onKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.setState({ filter: '' });
    }
  };

  showButtons = (id) => {
    this.setState({ hoveredView: id });
  };

  hideButtons = () => {
    this.setState({ hoveredView: null });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.filterWrapper}>
          <div className={styles.filter}>
            <div className={styles.filterLabel}>Filter:</div>
            <Input
              value={this.state.filter}
              onChange={this.changeFilter}
              onKeyDown={this.onKeyDown}
              placeholder="Type here to filter results"
            />
          </div>
        </div>
        <div className={styles.availableViewsWrapper}>
          <div title="Create a New View" className={viewLauncherStyles.view} onClick={this.createNewView}>
            <div className={[viewLauncherStyles.preview, viewLauncherStyles.new].join(' ')}>
              <div className={viewLauncherStyles.plus}> + </div>
            </div>
            <div className={viewLauncherStyles.name}> CREATE NEW VIEW </div>
          </div>

          {this.props.views.length > 0 &&
            this.props.views.map((view, index) => {
              let viewName = view.name.replace(/[a-z\s]/g, '').substring(0, 6);
              let imgURL = view.thumbnail ? `${ManagerInterface.getMediaBaseUrl()}${view.thumbnail}` : '';
              if (viewName === '') viewName = view.name.substring(0, 3).toUpperCase();
              return (
                (this.state.filter === '' || new RegExp(this.state.filter, 'i').test(view.name)) && (
                  <ViewLauncher
                    key={view.id}
                    imgURL={imgURL}
                    view={view}
                    index={index}
                    showButtons={this.showButtons.bind(this, view.id)}
                    hideButtons={this.hideButtons.bind(this)}
                    hovered={this.state.hoveredView === view.id}
                    editView={this.editView}
                    changeViewToDelete={this.changeViewToDelete}
                    openView={this.openView}
                  />
                )
              );
            })}
        </div>
        <ConfirmationModal
          isOpen={this.state.viewToDelete !== null}
          message={`Are you sure you want to delete the view ${
            this.state.viewToDelete ? this.state.viewToDelete.name : null
          }?`}
          confirmCallback={() => this.deleteView(this.state.viewToDelete.id)}
          cancelCallback={() => this.changeViewToDelete(null)}
        />
      </div>
    );
  }
}
export default withRouter(ViewsIndex);
