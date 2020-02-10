import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../GeneralPurpose/Button/Button';

import styles from './ViewsIndex.module.css';
import Input from '../../GeneralPurpose/Input/Input';

class ViewsIndex extends Component {
  static propTypes = {
    /** React Router history object */
    history: PropTypes.object,
    /** Current views to display */
    views: PropTypes.array,
    /** Current views to display */
    deleteView: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
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

  deleteView = (id) => {
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
          <div className={styles.availableViewsBar}>
            {this.props.views.length > 0 &&
              this.props.views.map(
                (view, index) =>
                  (this.state.filter === '' || new RegExp(this.state.filter, 'i').test(view.name)) && (
                    <React.Fragment key={index}>
                      <span className={[styles.linkListItem, styles.viewIndex].join(' ')}> {`${index + 1}. `} </span>
                      <span className={[styles.linkListItem, styles.viewName].join(' ')}> {view.name} </span>
                      <div className={[styles.linkListItem, styles.buttons].join(' ')}>
                        <Button onClick={() => this.openView(view.id)}>Open</Button>
                        <Button onClick={() => this.editView(view.id)}>Edit</Button>
                        <Button onClick={() => this.deleteView(view.id)}>Delete</Button>
                      </div>
                    </React.Fragment>
                  ),
              )}
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
