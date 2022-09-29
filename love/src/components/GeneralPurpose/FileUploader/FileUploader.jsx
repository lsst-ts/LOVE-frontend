import React from 'react';
import Button from '../Button/Button';
import styles from './FileUploader.module.css';

const FileUploader = ({ value = '', handleFile = () => {}, handleDelete = () => {}, ...props }) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded !== undefined) handleFile(fileUploaded);
  };

  return (
    <div className={styles.containerFileUpload}>
      <Button onClick={handleClick} className={styles.inputButton}>
        Select File
      </Button>
      <span className={styles.inputText} onClick={handleClick}>
        {value}
      </span>
      {value ? (
        <span className={styles.inputClose} onClick={handleDelete}>
          x
        </span>
      ) : (
        <span className={styles.inputClose}></span>
      )}
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
};
export default FileUploader;
