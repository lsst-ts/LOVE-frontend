import React, { Component } from 'react'
import styles from './Button.module.css'
import ImportIcon from '../../icons/ImportIcon/ImportIcon';

export default class UploadButton extends Component {

    onChange = (event) => {
        // console.log(event);
        var reader = new FileReader();
        reader.onload = (event) => {
            this.props.onLoadFile(event.target.result);
        };
        reader.readAsText(event.target.files[0]);
    }

    render() {
        return (
            <form action="#">
                <div className={[styles.button, styles.uploadButton].join(' ')}>
                    <input onChange={this.onChange} type="file" id="my-file" className={styles.customFileInput} />
                    <ImportIcon></ImportIcon>
                    <label tabIndex="0" htmlFor="my-file" className={styles.inputFileTrigger}>Import</label>
                </div>
            </form>
        )
    }
}
