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

          <div className={styles.view} onClick={this.createNewView}>
            <span className={styles.name}> CREATE NEW VIEW </span>
          </div>

          {this.props.views.length > 0 &&
            this.props.views.map(
              (view, index) =>
                (this.state.filter === '' || new RegExp(this.state.filter, 'i').test(view.name)) && (
                  <div
                    key={index}
                    className={styles.view}
                    onClick={() => this.openView(view.id)}
                  >
                    <span className={styles.name}> {view.name} </span>
                    <div className={styles.buttons}>
                      <Button onClick={(event) => {event.stopPropagation(); this.openView(view.id)}}>Open</Button>
                      <Button onClick={(event) => {event.stopPropagation(); this.editView(view.id)}}>Edit</Button>
                      <Button onClick={(event) => {event.stopPropagation(); this.deleteView(view.id)}}>Delete</Button>
                    </div>
                  </div>
                ),
            )}
        </div>
      </div>
    );
  }
}
export default withRouter(ViewsIndex);
