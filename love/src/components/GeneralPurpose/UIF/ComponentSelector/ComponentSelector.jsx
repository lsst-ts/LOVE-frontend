import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentSelector.module.css';
import {indexes} from '../ComponentIndex';


export default class ComponentSelector extends Component {
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
    return (
      <>
        <div className={styles.container}>
          <h2> Select Components to add to the view </h2>

          {indexes.map((index) => {
            const category = index['name'];
            const componentsMap = index['index'];
            return (
              <div key={category}>
                <h3> {category} </h3>
                <div className={styles.gallery}>
                  {Object.keys(componentsMap).map((component) => (
                    <div key={component} className={styles.component}>
                      <h4> {component} </h4>
                      <p> { componentsMap[component]['schema']['description'] }</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </>
    );
  }
}
