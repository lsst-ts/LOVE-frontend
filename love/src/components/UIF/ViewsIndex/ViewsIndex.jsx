import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../GeneralPurpose/Button/Button';

import styles from './ViewsIndex.module.css';

class ViewsIndex extends Component {
  static propTypes = {
    /** React Router history object */
    history: PropTypes.object,
    /** Current views to display */
    views: PropTypes.array,
    /** Current views to display */
    deleteView: PropTypes.func,
  };

  createNewView = () => {
    this.props.history.push('/uif/view-editor');
  };

  editView = (id) => {
    this.props.history.push('/uif/view-editor?id=' + id);
  };

  openView = (id) => {
    this.props.history.push('/uif/view?id=' + id);
  };

  deleteView = (id) => {
    this.props.deleteView(id).then((success) => {
      if (success) {
        toast.success('View deleted successfully');
      } else {
        toast.error('View deletion failed');
      }
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <h1>UI Framework</h1>
        <div className={styles.availableViewsWrapper}>
          <div className={styles.availableViewsBar}>
            <h2 className={styles.availableViewsTitle}>Available Views</h2>
            <div>
              <input />
              <Button>Filter</Button>
            </div>
            {/* <ol className={styles.linkList}> */}
            {this.props.views.length > 0 &&
              this.props.views.map((view, index) => (
                <React.Fragment key={index + '1'}>
                    <span className={[styles.linkListItem, styles.viewIndex].join(' ')}> {index + 1 + '. '} </span>
                    <span className={[styles.linkListItem, styles.viewName].join(' ')}> {view.name} </span>
                  <div className={[styles.linkListItem, styles.buttons].join(' ')}>
                    <Button onClick={() => this.openView(view.id)}>Open</Button>
                    <Button onClick={() => this.editView(view.id)}>Edit</Button>
                    <Button onClick={() => this.deleteView(view.id)}>Delete</Button>
                  </div>
                </React.Fragment>
              ))}
            {/* </ol> */}
          </div>
          <div className={styles.newViewButtonWrapper}>
            <Button onClick={this.createNewView}>New View</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ViewsIndex);
