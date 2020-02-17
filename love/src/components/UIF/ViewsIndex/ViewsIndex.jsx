import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../GeneralPurpose/Button/Button';
import Input from '../../GeneralPurpose/Input/Input';
import Modal from '../../GeneralPurpose/Modal/Modal';
import ConfirmationDialog from '../../GeneralPurpose/ConfirmationDialog/ConfirmationDialog';
import EditIcon from '../../icons/EditIcon/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon/DeleteIcon';
import ManagerInterface from '../../../Utils';

import styles from './ViewsIndex.module.css';

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
            <Input className={styles.input} value={this.state.filter} onChange={this.changeFilter} />
          </div>
        </div>
        <div className={styles.availableViewsWrapper}>
          <div title="Create a New View" className={styles.view} onClick={this.createNewView}>
            <div className={[styles.preview, styles.new].join(' ')}>
              <div className={styles.plus}> + </div>
            </div>
            <div className={styles.name}> CREATE NEW VIEW </div>
          </div>

          {this.props.views.length > 0 &&
            this.props.views.map(
              (view, index) =>
                (this.state.filter === '' || new RegExp(this.state.filter, 'i').test(view.name)) && (
                  <div
                    title="Open"
                    key={index}
                    className={styles.view}
                    onClick={() => this.openView(view.id)}
                    onMouseEnter={this.showButtons.bind(this, view.id)}
                    onTouchStart={this.showButtons.bind(this, view.id)}
                    onTouchMove={this.showButtons.bind(this, view.id)}
                    onMouseLeave={this.hideButtons.bind(this)}
                  >
                    <div className={styles.preview}>
                      <span className={styles.imageFallback}>{view.name.replace(/[a-z\s]/g, '').substring(0, 6)}</span>
                      <img
                        src={`${ManagerInterface.getMediaBaseUrl()}${view.thumbnail}`}
                        onLoad={(ev) => (ev.target.style.display = 'block')}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className={styles.name}> {view.name} </div>
                    <div
                      className={[styles.buttons, this.state.hoveredView === view.id ? styles.visible : null].join(' ')}
                    >
                      <Button
                        className={styles.iconButton}
                        title="Edit"
                        onClick={(event) => {
                          event.stopPropagation();
                          this.editView(view.id);
                        }}
                      >
                        <EditIcon className={styles.icon} />
                      </Button>
                      <Button
                        className={styles.iconButton}
                        title="Delete"
                        onClick={(event) => {
                          event.stopPropagation();
                          this.changeViewToDelete(view);
                        }}
                      >
                        <DeleteIcon className={styles.icon} />
                      </Button>
                    </div>
                  </div>
                ),
            )}
        </div>
        <Modal
          isOpen={this.state.viewToDelete !== null}
          onRequestClose={() => this.changeViewToDelete(null)}
          contentLabel="Confirmation Dialog"
          modalClassName={styles.confirmationDialogModal}
        >
          <ConfirmationDialog
            message={`Are you sure you want to delete the view ${
              this.state.viewToDelete ? this.state.viewToDelete.name : null
            }?`}
            confirmCallback={() => this.deleteView(this.state.viewToDelete.id)}
            cancelCallback={() => this.changeViewToDelete(null)}
          />
        </Modal>
      </div>
    );
  }
}
export default withRouter(ViewsIndex);
