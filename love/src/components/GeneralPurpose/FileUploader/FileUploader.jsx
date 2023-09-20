/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import Button from '../Button/Button';
import styles from './FileUploader.module.css';

const FileUploader = ({ value = '', handleFile = () => {}, handleDelete = () => {}, ...props }) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.value = null;
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
