/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
