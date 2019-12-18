import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


export default class Layout extends Component {

  static propTypes = {
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  render() {
    toast.info('blah');
    console.log('props: ', this.props);
    return (
      <>
        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} />
        {this.props.children}
      </>
    );
  }
}
