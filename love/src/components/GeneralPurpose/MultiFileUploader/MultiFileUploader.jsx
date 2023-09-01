import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './MultiFileUploader.module.css';

const MultiFileUploader = ({
  values = {},
  handleFiles = () => {},
  handleDelete = () => {},
  handleDeleteAll = () => {},
}) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.value = null;
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const filesUploaded = event.target.files;
    if (filesUploaded !== undefined) handleFiles(filesUploaded);
  };

  return (
    <div className={styles.containerFileUpload}>
      <Button onClick={handleClick} className={styles.inputButton}>
        Select Files
      </Button>
      <span className={styles.inputText} onClick={handleClick}>
        {Object.entries(values).map(([key, file]) => (
          <span key={key} className={styles.fileBadge}>
            {file.name}
            <span
              className={styles.inputClose}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(key);
              }}
            >
              &times;
            </span>
          </span>
        ))}
      </span>
      {values ? (
        <span className={styles.inputCloseAll} onClick={handleDeleteAll}>
          &times;
        </span>
      ) : (
        <span className={styles.inputClose}></span>
      )}
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} multiple />
    </div>
  );
};

MultiFileUploader.propTypes = {
  /** Values as FileList  */
  values: PropTypes.object,
  /** Function to handle files add */
  handleFiles: PropTypes.func,
  /** Function to handle specific file delete */
  handleDelete: PropTypes.func,
  /** Function to handle all files delete */
  handleDeleteAll: PropTypes.func,
};
export default MultiFileUploader;
