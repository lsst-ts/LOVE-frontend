import * as React from 'react';
import { PointModel } from '@projectstorm/react-diagrams-core';

export class LinkPointWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      highlighted: false,
      grabbed: false,
    };
  }

  render() {
    const { point } = this.props;
    return (
      <g>
        <circle
          cx={point.getPosition().x}
          cy={point.getPosition().y}
          r={3}
            // fill={this.state.selected || this.props.point.isSelected() ? this.props.colorSelected : this.props.color}
          fill={this.state.highlighted ? 'gray' : 'white'}
        />
        <circle
          style={{
            pointerEvents: 'all',
          }}
          onMouseLeave={() => {
            this.setState({ highlighted: false });
          }}
          onMouseEnter={() => {
            this.setState({ highlighted: true });
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
