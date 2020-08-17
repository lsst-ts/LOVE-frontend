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
