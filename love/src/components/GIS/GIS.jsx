import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { CardList, Card, Title, Separator } from 'components/GeneralPurpose/CardList/CardList';
import { signals, effects } from '../../Config';

export default class GIS extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    console.log(signals);
    return (
      <div className={styles.div}>
        <box className={styles.div2}></box>
        {/* <Separator className={styles.separator}/> */}
        <box className={styles.div2}></box>
      </div>
    );
  }
}
