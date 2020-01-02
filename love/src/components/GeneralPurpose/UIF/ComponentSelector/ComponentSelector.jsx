import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentSelector.module.css';
import {uifIndex, auxtelIndex, mainIndex, indexes} from '../ComponentIndex';


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

          {indexes.map((index) => (
            <>
              <h3> {index['name']} </h3>
              <div className={styles.gallery}>
                {Object.keys(index['index']).map((name) => (
                  <>
                    <div className={styles.component}>
                      <h4> {name} </h4>
                      <p> Component used to display Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur leo at interdum aliquam. Integer at ante quis risus scelerisque dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In egestas sodales volutpat. Praesent congue est quis diam porta placerat. In iaculis fermentum arcu. Donec ultricies elementum velit quis tincidunt. Nulla risus neque, posuere sit amet velit ac, iaculis tempor diam. Nulla lacinia in massa vel maximus. Nulla facilisi.  </p>
                    </div>
                  </>
                ))}
              </div>
            </>
          ))}

        </div>
      </>
    );
  }
}
