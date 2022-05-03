import React from 'react';
import Button from '../Button/Button';
import styles from './FileUploader.module.css';

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded !== undefined) props.handleFile(fileUploaded);
  };

  const handleDelete = event => {
    props.handleDelete();
  };

  return (
    <div className={styles.containerFileUpload}>
      <Button
        onClick={handleClick}
        className={styles.inputButton}
      >
        Select File
      </Button>
      <span
        className={styles.inputText}
        onClick={handleClick}
      >
        {props.value}
      </span>
      {props.value
        ? <span className={styles.inputClose} onClick={handleDelete}>x</span>
        : <span className={styles.inputClose}>  </span>
      }
      <input type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display:'none'}}
      /> 
    </div>
  );
};
export default FileUploader;

FileUploader.defaultProps = {
  handleFile: () => {},
  handleDelete: () => {},
  value: "",
}

// {` ${this.state.logEdit.file.name} (${ (parseInt(this.state.logEdit.file.size) / 1024).toFixed(2)} KB) `}