import * as React from 'react';

export class AdvancedLinkSegmentWidget extends React.Component {
  highlightedColor = getComputedStyle(document.body).getPropertyValue('--second-quinary-background-color');

  topCircle = React.createRef();
  bottomCircle = React.createRef();

  state = {
    highlighted: false,
  };

  componentDidMount() {
    const path = this.props.forwardRef.current;
    const midPoint = path.getPointAtLength(path.getTotalLength() * 0.5);

    this.topCircle.current.setAttribute('cx', '' + midPoint.x);
    this.topCircle.current.setAttribute('cy', '' + midPoint.y);
    this.bottomCircle.current.setAttribute('cx', '' + midPoint.x);
    this.bottomCircle.current.setAttribute('cy', '' + midPoint.y);
  }
  render() {
    const selected = this.props.selected || this.props.link.isSelected();

    const commonProps = {
      pointerEvents: 'all',
      style: { cursor: 'pointer' },
      onMouseEnter: () => {
        this.setState({
          highlighted: true,
        });
      },
      onMouseLeave: () => {
        this.setState({
          highlighted: false,
        });
      },
    };

    const color = selected ? this.props.link.getOptions().selectedColor : this.props.link.getOptions().color;
    return (
      <g>
        <path
          strokeLinecap="round"
          stroke={this.highlightedColor}
          opacity={this.state.highlighted ? 0.7 : 0}
          strokeWidth={this.props.link.getOptions().width + 10}
          d={this.props.path}
          {...commonProps}
        />
        <path
          ref={this.props.forwardRef}
          stroke={color}
          strokeWidth={this.props.link.getOptions().width}
          d={this.props.path}
          {...commonProps}
        />

        <circle ref={this.bottomCircle} r={6.4} stroke={color} fill={color} opacity={0.5} {...commonProps} />
        <circle ref={this.topCircle} r={3.2} stroke={color} fill={color} {...commonProps} />
      </g>
    );
  }
}
