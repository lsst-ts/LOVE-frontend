import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../GeneralPurpose/Button/Button';
import styles from './ComponentSelector.module.css';
import { indexes } from '../ComponentIndex';

export default class ComponentSelector extends Component {
  static propTypes = {
    /** Children components */
    children: PropTypes.node,
    /** Function to call when the "insert" button is clicked */
    selectCallback: PropTypes.func,
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
        selected: [...this.state.selected, component],
      });
    } else {
      this.setState({
        selected: this.state.selected.filter((comp) => comp !== component),
      });
    }
  };

  clearSelection = () => {
    this.setState({
      selected: [],
    });
  };

  render() {
    const buttonsDisabled = this.state.selected.length === 0;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h2> Select Components to add to the view </h2>

          {indexes.map((index) => {
            const category = index.name;
            const componentsMap = index.index;
            return (
              <div key={category}>
                <h3> {category} </h3>
                <div className={styles.gallery}>
                  {Object.keys(componentsMap).map((component) => {
                    const componentDict = componentsMap[component];
                    componentDict.name = component;
                    const selected = this.state.selected.includes(componentDict);
                    const checkboxId = `checkbox-${component}`;
                    return (
                      <div
                        key={component}
                        className={[styles.card, selected ? styles.selected : null].join(' ')}
                        onClick={() => this.addOrRemoveFromSelection(componentDict)}
                      >
                        <div className={styles.cardHeader}>
                          <h4> {component} </h4>
                          <div className={styles.customCheckbox} id={checkboxId}>
                            <input type="checkbox" readOnly className={styles.checkbox} checked={selected} />
                            <label htmlFor={checkboxId} />
                          </div>
                        </div>
                        <p> {componentDict.schema.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <span />
          <Button status="default" disabled={buttonsDisabled} onClick={this.clearSelection}>
            Clear Selection
          </Button>
          <Button
            status="primary"
            disabled={buttonsDisabled}
            onClick={() => this.props.selectCallback(this.state.selected)}
          >
            Insert
          </Button>
        </div>
      </div>
    );
  }
}
