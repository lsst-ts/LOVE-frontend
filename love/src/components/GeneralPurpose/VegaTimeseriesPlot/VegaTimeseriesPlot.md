Render a line using default styles

```jsx
import moment from 'moment';

const length = 100;
const dt = 2;
const data = new Array(length).fill({}).map((_, index) => {
  return {
    name: 'example-1',
    x: moment().subtract(dt * (length - 1 - index), 'seconds'),
    y: Math.cos((index * Math.PI) / length / 2),
  };
});

const marksStyles = [
  {
    name: 'example-1',
  },
];

<div style={{ width: '500px', height: '200px', background: 'var(--secondary-background-dimmed-color)' }}>
    <VegaTimeseriesPlot
      layers={{
        lines: data,
      }}
      xAxisTitle="date title"
      yAxisTitle="values title"
      marksStyles={marksStyles}
      temporalXAxis
    />
    ;
</div>;
```
