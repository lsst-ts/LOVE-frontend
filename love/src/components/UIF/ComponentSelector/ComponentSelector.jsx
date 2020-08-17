import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../GeneralPurpose/Button/Button';
import Input from '../../GeneralPurpose/Input/Input';
import styles from './ComponentSelector.module.css';
import { indexes } from '../ComponentIndex';
import Modal from '../../GeneralPurpose/Modal/Modal';

export default class ComponentSelector extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
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
      filter: '',
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

  onModalClose = (event) => {
    this.props.onRequestClose(event);
    this.clearSelection();
  };

  onInsertButtonClick = () => {
    this.props.selectCallback(this.state.selected);
    this.clearSelection();
  };

  changeFilter = (event) => {
    this.setState({
      filter: event.target.value,
    });
  };
  render() {
    const buttonsDisabled = this.state.selected.length === 0;
    let regex = null;
    try {
      regex = new RegExp(this.state.filter, 'i');
    } catch (e) {
      console.error('Error in regular expression, using simple string includes instead. ', e);
    }
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.onModalClose}
        contentLabel="Component selection modal"
        footerChildren={
          <>
            <Button status="default" disabled={buttonsDisabled} onClick={this.clearSelection}>
              Clear Selection
            </Button>
            <Button
              status="primary"
              disabled={buttonsDisabled}
              onClick={this.onInsertButtonClick}
              // onClick={() => this.props.selectCallback(this.state.selected)}
            >
              Insert
            </Button>
          </>
        }
      >
        <div className={styles.content}>
          <h2> Select Components </h2>
          <div className={styles.filterContainer}>
            <span className={styles.filterLabel}>Filter: </span>
            <Input value={this.state.filter} onChange={this.changeFilter} />
          </div>

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
                    const filter =
                      this.state.filter === '' || regex
                        ? regex.test(componentDict.name)
                        : componentDict.name.includes(this.state.filter);
                    return (
                      filter && (
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
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }
}
