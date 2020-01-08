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

  constructor() {
    super();
    this.state = {
      selected: [],
    };
  }

  addOrRemoveFromSelection = (component) => {
    if (!this.state.selected.includes(component)) {
      this.setState({
        selected:  [...this.state.selected, component],
      });
    } else {
      this.setState({
        selected:  this.state.selected.filter(comp => comp !== component),
      });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h2> Select Components to add to the view </h2>

          {indexes.map((index) => {
            const category = index['name'];
            const componentsMap = index['index'];
            return (
              <div key={category}>
                <h3> {category} </h3>
                <div className={styles.gallery}>
                  {Object.keys(componentsMap).map((component) => {
                    const selected = this.state.selected.includes(component)
                    const checkboxId = 'checkbox-' + component;
                    return (
                      <div
                        key={component}
                        className={[styles.card, selected ? styles.selected : null].join(' ')}
                        onClick={() => this.addOrRemoveFromSelection(component)}
                      >
                        <div className={styles.cardHeader}>
                          <h4> {component} </h4>
                          <div className={styles.customCheckbox} id={checkboxId}>
                            <input type="checkbox" className={styles.checkbox} checked={selected}/>
                            <label for={checkboxId} />
                          </div>
                        </div>
                        <p> { componentsMap[component]['schema']['description'] }</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.footer}>
          
        </div>
      </div>
    );
  }
}
