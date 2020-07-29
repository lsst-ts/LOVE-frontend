import * as React from 'react';

export const AdvancedLinkSegmentWidget = (props) => {
  const highlightedColor = React.useMemo(
    () => getComputedStyle(document.body).getPropertyValue('--second-quinary-background-color'),
    [],
  );

  const topCircle = React.useRef();
  const bottomCircle = React.useRef();

  const [highlighted, setHighlighted] = React.useState(false);

  React.useEffect(() => {
    const path = props.forwardRef.current;
    const midPoint = path.getPointAtLength(path.getTotalLength() * 0.5);

    topCircle.current.setAttribute('cx', '' + midPoint.x);
    topCircle.current.setAttribute('cy', '' + midPoint.y);
    bottomCircle.current.setAttribute('cx', '' + midPoint.x);
    bottomCircle.current.setAttribute('cy', '' + midPoint.y);
  });

  const selected = props.selected || props.link.isSelected();

  const commonProps = {
    pointerEvents: 'all',
    style: { cursor: 'pointer' },
    onMouseEnter: () => {
      setHighlighted(true);
    },
    onMouseLeave: () => {
      setHighlighted(false);
    },
  };

  const color = selected ? props.link.getOptions().selectedColor : props.link.getOptions().color;
  return (
    <g>
      <path
        strokeLinecap="round"
        stroke={highlightedColor}
        opacity={highlighted ? 0.7 : 0}
        strokeWidth={props.link.getOptions().width + 10}
        d={props.path}
        {...commonProps}
      />
      <path
        ref={props.forwardRef}
        stroke={color}
        strokeWidth={props.link.getOptions().width}
        d={props.path}
        {...commonProps}
      />

      <circle ref={bottomCircle} r={6.4} stroke={color} fill={color} opacity={0.5} {...commonProps} />
      <circle ref={topCircle} r={3.2} stroke={color} fill={color} {...commonProps} />
    </g>
  );
};
