/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import * as React from 'react';

export class LinkPointWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      hovered: false,
      grabbed: false,
    };
  }

  handleMove = (event) => {
    const newPosition = this.props.diagramEngine.getRelativeMousePoint(event);

    this.props.point.setPosition(newPosition);
  };

  handleUp = () => {
    console.log('up');
  };

  handleUp = (event) => {
    // Unregister handlers to avoid multiple event handlers for other links
    this.setState({ canDrag: false, selected: false });
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleUp);
  };

  render() {
    const { point } = this.props;

    return (
      <g>
        {this.state.hovered && (
          <circle
            cx={point.getPosition().x}
            cy={point.getPosition().y}
            opacity={0.5}
            r={5}
            // fill={this.state.selected || this.props.point.isSelected() ? this.props.colorSelected : this.props.color}
            fill={'white'}
          />
        )}
        <circle
          style={{
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          onMouseLeave={() => {
            this.setState({ hovered: false });
          }}
          onMouseEnter={() => {
            this.setState({ hovered: true });
          }}
          onMouseDown={() => {
            window.addEventListener('mousemove', this.handleMove);
            window.addEventListener('mouseup', this.handleUp);
          }}
          //   onMouseDown={(ev) => {
          //     this.setState({
          //       grabbed: true,
          //     });
          //     ev.preventDefault();
          //     ev.stopPropagation();
          //   }}
          //   onMouseUp={(ev) => {
          //     this.setState({
          //       grabbed: false,
          //     });
          //   }}
          data-id={point.getID()}
          data-linkid={point.getLink().getID()}
          cx={point.getPosition().x}
          cy={point.getPosition().y}
          r={20}
          opacity={0}
        />
      </g>
    );
  }
}
