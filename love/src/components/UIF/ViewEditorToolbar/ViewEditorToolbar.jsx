import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../GeneralPurpose/Button/Button';
import styles from './ViewEditorToolbar.module.css';
import { editViewStates } from '../../../redux/reducers/uif';


class ViewEditorToolbar extends Component {
  static propTypes = {
    /** Status of the view being edited */
    editedViewStatus: PropTypes.object,
    /** Function to add components to view */
    addComponents: PropTypes.func,
    /** Function to save the edited view to the server (POST or PUT) */
    save: PropTypes.func,
    /** Function to undo changes */
    undo: PropTypes.func,
    /** Function to redo changes */
    redo: PropTypes.func,
  };

  static defaultProps = {
    addComponents: () => {},
    save: () => {},
    undo: () => {},
    redo: () => {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    const isSaved = this.props.editedViewStatus && this.props.editedViewStatus.code === editViewStates.SAVED;
    return (
      <div className={styles.container}>
        <Button onClick={this.props.addComponents}>
           Add Components
       </Button>
        <Button onClick={this.props.save} disabled={isSaved}>
          Save Changes
        </Button>
      </div>
    );
  }
}

export default withRouter(ViewEditorToolbar);
