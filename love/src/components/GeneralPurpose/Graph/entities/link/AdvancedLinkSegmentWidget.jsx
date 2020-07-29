import * as React from 'react';

export const AdvancedLinkSegmentWidget = ({ forwardRef, selected, link, extras, path, buttonLocation }) => {
  const highlightedColor = React.useMemo(
    () => getComputedStyle(document.body).getPropertyValue('--second-quinary-background-color'),
    [],
  );

  const topCircle = React.useRef();
  const bottomCircle = React.useRef();

  const [highlighted, setHighlighted] = React.useState(false);

  React.useEffect(() => {
    if (!topCircle.current || !bottomCircle.current) {
      return;
    }
    const path = forwardRef.current;
    const midPoint = path.getPointAtLength(path.getTotalLength() * buttonLocation);

    topCircle.current.setAttribute('cx', '' + midPoint.x);
    topCircle.current.setAttribute('cy', '' + midPoint.y);
    bottomCircle.current.setAttribute('cx', '' + midPoint.x);
    bottomCircle.current.setAttribute('cy', '' + midPoint.y);
  });

  const commonProps = {
    pointerEvents: 'all',
    style: { cursor: 'pointer' },
    onMouseEnter: () => {
      setHighlighted(true);
    },
    onMouseLeave: () => {
      setHighlighted(false);
    },
    ...extras,
  };

  const color = selected || link.isSelected() ? link.getOptions().selectedColor : link.getOptions().color;
  return (
    <g>
      <path
        strokeLinecap="round"
        stroke={highlightedColor}
        opacity={highlighted ? 0.7 : 0}
        strokeWidth={link.getOptions().width + 10}
        d={path}
        {...commonProps}
      />
      <path ref={forwardRef} stroke={color} strokeWidth={link.getOptions().width} d={path} {...commonProps} />

      {buttonLocation !== undefined && (
        <>
          <circle ref={bottomCircle} r={6.4} stroke={color} fill={color} opacity={0.5} {...commonProps} />
          <circle ref={topCircle} r={3.2} stroke={color} fill={color} {...commonProps} />
        </>
      )}
    </g>
  );
};
