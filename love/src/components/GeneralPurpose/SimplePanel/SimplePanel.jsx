import React, { Component } from 'react';

export default class Panel extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     height: 0
    // };
  }

  componentDidMount() {
    // window.setTimeout(() => {
    // 	const el = ReactDOM.findDOMNode(this);
    // 	const height = el.querySelector('.panel__inner').scrollHeight;
    // 	this.setState({
    // 		height
    // 	});
    // }, 333);
  }

  render() {
    const { label, content, maxHeight, isActive } = this.props;
    // const { height } = this.state;
    const innerStyle = {
      height: `${isActive ? maxHeight : 0}px`,
      willChange: 'height',
      transition: 'height .4s cubic-bezier(.65, .05, .36, 1)',
    };

    return (
      <div
        className="panel"
        style={{ overflow: 'hidden', background: `${isActive ? 'var(--secondary-background-color)' : ''}` }}
        role="tabpanel"
        aria-expanded={isActive}
      >
        {/* <button className='panel__label'
					role='tab'
					onClick={ activateTab }>
					{ label }
				</button> */}
        <div className="panel__inner" style={innerStyle} aria-hidden={!isActive}>
          <p className="panel__content">{content}</p>
        </div>
      </div>
    );
  }
}
