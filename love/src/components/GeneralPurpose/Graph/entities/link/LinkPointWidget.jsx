import * as React from 'react';
import { PointModel } from '@projectstorm/react-diagrams-core';

export class LinkPointWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      hovered: false,
      grabbed: false,
    };
  }

  render() {
    const { point, location } = this.props;

    return (
      <g>
        {this.state.hovered && (
          <circle
            cx={point.getPosition().x}
            cy={point.getPosition().y}
            r={5}
            // fill={this.state.selected || this.props.point.isSelected() ? this.props.colorSelected : this.props.color}
            fill={'white'}
          />
        )}
        <circle
          style={{
            pointerEvents: 'all',
          }}
          onMouseLeave={() => {
            this.setState({ hovered: false });
          }}
          onMouseEnter={() => {
            this.setState({ hovered: true });
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
