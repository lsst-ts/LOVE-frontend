import React, { Component } from 'react'
import styles from './ArrowIcon.module.css'

export default class ArrowIcon extends Component {
    render() {
        let status = this.props.active ? styles.active : styles.inactive;
        let up = this.props.up;
        return (
            <svg className={[styles.arrowIcon, status, this.props.style].join(' ')} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'>
                {
                    up ?
                        <path className='cls-1' d='M11.74,5.47,9.2,3A.18.18,0,0,0,9.05,3,.19.19,0,0,0,8.9,3L6.4,5.47a.18.18,0,0,0,0,.22.17.17,0,0,0,.18.13h2v8a.17.17,0,0,0,.05.14.2.2,0,0,0,.15.06h.7a.17.17,0,0,0,.14-.06.18.18,0,0,0,.06-.14v-8h2a.19.19,0,0,0,.19-.13A.22.22,0,0,0,11.74,5.47Z'/>
                        :
                        <path className='cls-1' d='M6.4,11.48l2.53,2.46a.25.25,0,0,0,.16.06.24.24,0,0,0,.15-.06l2.5-2.46a.22.22,0,0,0,0-.22.19.19,0,0,0-.19-.12h-2v-8A.2.2,0,0,0,9.56,3,.17.17,0,0,0,9.42,3h-.7A.2.2,0,0,0,8.57,3a.2.2,0,0,0-.05.15v8h-2a.19.19,0,0,0-.18.12A.18.18,0,0,0,6.4,11.48Z'/>
                }
            </svg>
        )
    }
}

ArrowIcon.defaultProps = {
    style: ''
};