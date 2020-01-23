import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../Button/Button';

import styles from './ViewsIndex.module.css';

class ViewsIndex extends Component {
  static propTypes = {
    /** React Router history object */
    history: PropTypes.object,
    /** Current views to display */
    views: PropTypes.array,
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

  render() {
    return (
      <div className={styles.container}>
        <h1>UI Framework</h1>
        <h2>Available Views</h2>
        <ol className={styles.linkList}>
          {this.props.views.length > 0 &&
            this.props.views.map((view, index) => (
              <li key={index} className={styles.linkListItem}>
                <span> {index + 1 + '. '} </span>
                <span> {view.name} </span>
                <Button onClick={() => this.openView(view.id)}>Open</Button>
                <Button onClick={() => this.editView(view.id)}>Edit</Button>
              </li>
            ))}
        </ol>
        <Button onClick={this.createNewView}>New View</Button>
      </div>
    );
  }
}
export default withRouter(ViewsIndex);
