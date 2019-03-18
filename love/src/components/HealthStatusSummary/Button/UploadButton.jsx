import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import ImportIcon from '../../icons/ImportIcon/ImportIcon';

export default class UploadButton extends Component {
  static propTypes = {
    onLoadFile: PropTypes.func,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    iconClassName: PropTypes.string,
  };

  onChange = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => this.props.onLoadFile(e.target.result);
    reader.readAsText(event.target.files[0]);
  };

  render() {
    const classNames = [styles.button, styles.uploadButton, this.props.className].join(' ');
    const labelClassNames = [styles.inputFileTrigger, this.props.labelClassName].join(' ');
    return (
      <form action="#">
        <div className={classNames}>
          <input onChange={this.onChange} type="file" id="my-file" className={styles.customFileInput} />
          <label tabIndex="0" htmlFor="my-file" className={labelClassNames}>
          <ImportIcon className={this.props.iconClassName} />
            Import
          </label>
        </div>
      </form>
    );
  }
}
