import React from "react";
import styles from './LoadInfoIcon.module.css';

export default function LoadInfoIcon(props){
    const className = [styles.loadInfoIcon, props.className].join(' ');
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={className} {...props}>
            <path 
                d="m10,0C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0Zm-2.53,7.54h1.45v-2.87c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v2.87h1.45c.33,0,.54.36.37.65l-2.52,4.37c-.17.29-.58.29-.75,0l-2.52-4.37c-.17-.29.04-.65.37-.65Zm7.89,8.16H4.64v-4.63c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v2.48h6.43v-2.48c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v4.63Z"
                className={styles['cls-1']}
            />
        </svg>
    );
}