Render a line using default styles

```jsx
import moment from 'moment';
import VegaMiniPlot from './VegaMiniPlot';
import VegaLegend from './VegaLegend';

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

<div>
  <div style={{ display: 'flex', flexDirection: 'row', background: 'black', width: '500px' }}>
    <span> Example line </span>
    <VegaMiniPlot />
  </div>
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
  </div>
</div>;
```

Render many lines with custom styles

```jsx
import moment from 'moment';
import { COLORS, DASHES } from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);

const data = names
  .map((name, nameIndex) => {
    return new Array(length).fill({}).map((_, index) => {
      return {
        name,
        x: moment().subtract(dt * (length - 1 - index), 'seconds'),
        y: Math.cos(((index * Math.PI) / length / 2) * (nameIndex + 1)),
      };
    });
  })
  .flat();

const marksStyles = names.map((name, index) => ({
  name,
  color: COLORS[index % (COLORS.length - 1)],
  dash: DASHES[index % (DASHES.length - 1)],
}));

const gridData = [
  [
    {
      name: 'example-0',
      label: 'Line 0',
    },
    {
      name: 'example-3',
      label: 'Line 3',
    },
  ],
  [
    {
      mame: 'eexample-1',
      label: 'Line 1',
    },
    {
      name: 'example-4',
      label: 'Line 4',
    },
  ],
  [
    {
      mame: 'example-2',
      label: 'Line 2',
    },
  ],
];

<div style={{background: 'var(--secondary-background-dimmed-color)'}}>
  <div style={{ width: '500px', height: '200px' }}>
    <VegaTimeseriesPlot
      layers={{
        lines: data,
      }}
      xAxisTitle="Time"
      yAxisTitle="Quantity [u]"
      marksStyles={marksStyles}
      temporalXAxis
    />
  </div>
  <VegaLegend gridData={gridData} />
</div>;
```

Lines and lines with points.

**NOT YET IMPLENTED https://github.com/vega/vega-lite/issues/6496**

```jsx static
import moment from 'moment';
import { COLORS, DASHES } from './VegaTimeSeriesPlot';

const length = 100;
const dt = 2;
const names = ['line-1', 'line-2', 'line-3', 'pointline-4', 'pointline-5'];

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
  dash: DASHES[index % (COLORS.length - 1)],
}));

<div style={{ width: '500px', height: '200px', background: 'var(--secondary-background-dimmed-color)' }}>
  <VegaTimeseriesPlot
    layers={{
      lines: data.slice(0, 3).flat(),
      pointLines: data
        .slice(3)
        .map((d) => d.filter((el, index) => index % 5 === 0))
        .flat(),
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
  />
</div>;
```

Bars and lines

```jsx
import moment from 'moment';
import { COLORS, DASHES } from './VegaTimeSeriesPlot';

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

const bars = new Array(length / 5).fill({}).map((_, index) => {
  return {
    name: 'some bars',
    x: moment().subtract(dt * (length - 1 - index * 5), 'seconds'),
    y: Math.cos(((index * Math.PI) / length) * 25),
  };
});

const marksStyles = names
  .map((name, index) => ({
    name,
    color: COLORS[index % (COLORS.length - 1)],
    dash: DASHES[index % (COLORS.length - 1)],
  }))
  .concat({
    name: 'some bars',
    color: '#ddd',
  });

<div style={{ width: '500px', height: '200px', background: 'var(--secondary-background-dimmed-color)' }}>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
      bars,
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
  />
  ;
</div>;
```

- Legend component
- Tooltips
- Point lines
- Date x-axis
- Quantitative x-axis
- prop container node
