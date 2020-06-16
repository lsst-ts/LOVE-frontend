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

Render many lines with custom styles

```jsx
import moment from 'moment';
import { COLORS } from './VegaTimeSeriesPlot';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);
const data = new Array(length).fill({}).flatMap((_, index) => {
  return names.map((name, nameIndex) => ({
    name,
    x: moment().subtract(dt * (length - 1 - index), 'seconds'),
    y: Math.cos(((index * Math.PI) / length / 2) * (nameIndex + 1)),
  }));
});

const marksStyles = names.map((name, index) => ({
  name,
  color: COLORS[index % (COLORS.length - 1)],
}));

<div style={{ width: '500px', height: '200px', background: 'var(--secondary-background-dimmed-color)' }}>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
  />
  ;
</div>;
```

Lines and lines with points.

```jsx
import moment from 'moment';
import { COLORS } from './VegaTimeSeriesPlot';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);
const data = names.map((name, nameIndex) => {
  return new Array(length).fill({}).map((_, index) => {
    return {
      name,
      x: moment().subtract(dt * (length - 1 - index), 'seconds'),
      y: Math.cos(((index * Math.PI) / length / 2) * (nameIndex + 1)),
    };
  });
});

const marksStyles = names.map((name, index) => ({
  name,
  color: COLORS[index % (COLORS.length - 1)],
}));

<div style={{ width: '500px', height: '200px', background: 'var(--secondary-background-dimmed-color)' }}>
  <VegaTimeseriesPlot
    layers={{
      lines: data.slice(0, 3).flat(),
      pointLines: data.slice(3).map( d => d.filter((el, index) => index % 5 === 0 )).flat(),
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
  />
</div>;
```

* Bars
* Tooltips
* Date x-axis
* Quantitative x-axis