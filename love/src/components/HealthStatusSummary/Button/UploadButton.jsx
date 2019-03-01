import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import ImportIcon from '../../icons/ImportIcon/ImportIcon';

export default class UploadButton extends Component {
  static propTypes = {
    onLoadFile: PropTypes.func,
  };

  onChange = (event) => {
    // console.log(event);
    const reader = new FileReader();
    reader.onload = (e) => this.props.onLoadFile(e.target.result);
    reader.readAsText(event.target.files[0]);
  };

  render() {
    return (
      <form action="#">
        <div className={[styles.button, styles.uploadButton].join(' ')}>
          <input onChange={this.onChange} type="file" id="my-file" className={styles.customFileInput} />
          <ImportIcon />
          <label tabIndex="0" htmlFor="my-file" className={styles.inputFileTrigger}>
            Import
          </label>
        </div>
      </form>
    );
  }
}
