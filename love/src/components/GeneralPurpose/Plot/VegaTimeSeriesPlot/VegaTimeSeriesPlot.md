Render a line using default styles

```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot';
import VegaMiniPlot from './VegaMiniPlot';

const length = 100;
const dt = 2;
const data = new Array(length).fill({}).map((_, index) => {
  return {
    name: 'example-1',
    x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
    y: Math.cos((index * Math.PI) / length / 2),
  };
});

const marksStyles = [
  {
    name: 'example-1',
  },
];

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
  }}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <span> Example line </span>
    <VegaMiniPlot />
  </div>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
    }}
    xAxisTitle="date title"
    yAxisTitle="values title"
    marksStyles={marksStyles}
    temporalXAxis
    width={300}
    height={150}
  />
</div>;
```

## Plot with legend

Render many lines with custom styles with a fixed legend layout

```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot, { COLORS, DASHES } from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);

const data = names
  .map((name, nameIndex) => {
    return new Array(length).fill({}).map((_, index) => {
      return {
        name,
        x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
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
    { name: 'example-0', label: 'Line 0' },
    { name: 'example-3', label: 'Long label line 3' },
  ],
  // second row only has one column 
  // the second column will be filled automatically with an empty div
  [{ name: 'example-2', label: 'Line 2' }], 
  [
    { name: 'example-1', label: 'Line 1' },
    { name: 'example-4', label: 'Line 4' },
  ],
];

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
    display: 'grid',
    gridTemplateColumns: 'max-content max-content',
    columnGap: '1em'
  }}
>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
    width={500}
    height={200}
  />
  <VegaLegend gridData={gridData} marksStyles={marksStyles} />
</div>;
```

Render many lines with custom styles with an automatic and responsive legend layout


```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot, { COLORS, DASHES } from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);

const data = names
  .map((name, nameIndex) => {
    return new Array(length).fill({}).map((_, index) => {
      return {
        name,
        x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
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

const listData = [
  {
    name: 'example-0',
    label: 'Line 0',
  },
  {
    name: 'example-1',
    label: 'Line 1',
  },
  {
    name: 'example-2',
    label: 'Line 2',
  },
  {
    name: 'example-3',
    label: 'Long label line 3',
  },
  {
    name: 'example-4',
    label: 'Line 4',
  },
];

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
    display: 'flex',
    flexDirection: 'row',
  }}
>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
    }}
    xAxisTitle="Time"
    yAxisTitle="Quantity [u]"
    marksStyles={marksStyles}
    temporalXAxis
    containerNode={document.getElementById('vegaPlotContainer')}
    width={500}
    height={300}
  />
  <VegaLegend listData={listData} marksStyles={marksStyles} />
</div>;
```

## Different marks

Lines and lines with points.


```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot, { COLORS, DASHES } from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const names = ['line-1', 'line-2', 'line-3', 'pointline-4', 'pointline-5'];

const data = names.map((name, nameIndex) => {
  return new Array(length).fill({}).map((_, index) => {
    return {
      name,
      x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
      y: Math.cos(((index * Math.PI) / length / 2) * (nameIndex + 1)),
    };
  });
});

const listData = [
  {
    name: 'line-1',
    label: 'Line 1',
  },
  {
    name: 'line-2',
    label: 'Line 2',
  },
  {
    name: 'line-3',
    label: 'Line 3',
  },
  {
    name: 'pointline-4',
    label: 'PointLine 4',
    markType: 'pointLine',
  },
  {
    name: 'pointline-5',
    label: 'PointLine 5',
    markType: 'pointLine',
  },
];

const marksStyles = names.map((name, index) => ({
  name,
  color: COLORS[index % (COLORS.length - 1)],
  dash: DASHES[index % (COLORS.length - 1)],
}));

<div style={{ background: 'var(--secondary-background-dimmed-color)' }}>
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
    containerNode={document.getElementById('vegaPlotContainer')}
    width={500}
    height={200}
  />
</div>;
```

Bars and lines


```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot, { COLORS, DASHES } from './VegaTimeSeriesPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const names = new Array(5).fill('').map((_, index) => `example-${index}`);
const data = new Array(length).fill({}).flatMap((_, index) => {
  return names.map((name, nameIndex) => ({
    name,
    x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
    y: Math.cos(((index * Math.PI) / length / 2) * (nameIndex + 1)),
  }));
});

const bars = new Array(length / 5).fill({}).map((_, index) => {
  return {
    name: 'some bars',
    x: DateTime.local().minus({ seconds: dt * (length - 1 - index * 5) }),
    y: Math.cos(((index * Math.PI) / length) * 25),
  };
});

const listData = [
  {
    name: 'example-0',
    label: 'Line 0',
  },
  {
    name: 'example-1',
    label: 'Line 1',
  },
  {
    name: 'example-2',
    label: 'Line 2',
  },
  {
    name: 'example-3',
    label: 'Long label line 3',
  },
  {
    name: 'example-4',
    label: 'Line 4',
    markType: 'line',
  },
  {
    name: 'some bars',
    label: 'Bars',
    markType: 'bar',
  },
];

const marksStyles = names
  .map((name, index) => ({
    name,
    color: COLORS[index % (COLORS.length - 1)],
    dash: DASHES[index % (DASHES.length - 1)],
  }))
  .concat({
    name: 'some bars',
    color: '#ddd',
  });

<div style={{ background: 'var(--secondary-background-dimmed-color)' }}>
  <div id="vegaPlotContainer" style={{ width: '500px', height: '200px' }}>
    <VegaTimeseriesPlot
      layers={{
        lines: data,
        bars,
      }}
      xAxisTitle="Time"
      yAxisTitle="Quantity [u]"
      marksStyles={marksStyles}
      temporalXAxis
      containerNode={document.getElementById('vegaPlotContainer')}
    />
  </div>
  <VegaLegend listData={listData} marksStyles={marksStyles} />
</div>;
```

## Size and responsiveness

Fixed width and height


```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot';

const length = 100;
const dt = 2;
const data = new Array(length).fill({}).map((_, index) => {
  return {
    name: 'example-1',
    x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
    y: Math.cos((index * Math.PI) / length / 2),
  };
});

const marksStyles = [
  {
    name: 'example-1',
  },
];

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
  }}
>
  <VegaTimeseriesPlot
    layers={{
      lines: data,
    }}
    xAxisTitle="date title"
    yAxisTitle="values title"
    marksStyles={marksStyles}
    temporalXAxis
    width={800}
    height={100}
  />
</div>;
```

Responsive size: auto resize to fit parent (or any) node size


```jsx
import React from 'react';
import { DateTime } from 'luxon';
import VegaTimeseriesPlot from './VegaTimeSeriesPlot';
import VegaMiniPlot from './VegaMiniPlot';
import VegaLegend from './VegaLegend';

const length = 100;
const dt = 2;
const data = new Array(length).fill({}).map((_, index) => {
  return {
    name: 'example-1',
    x: DateTime.local().minus({ seconds: dt * (length - 1 - index) }),
    y: Math.cos((index * Math.PI) / length / 2),
  };
});

const marksStyles = [
  {
    name: 'example-1',
  },
];

const ResizingPlot = () => {
  const [time, setTime] = React.useState(0);
  const containerRef = React.useRef(undefined);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.1);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const width = 450 + 50 * Math.sin(time * Math.PI);
  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: '200px',
        background: 'var(--secondary-background-dimmed-color)',
      }}
    >
      <VegaTimeseriesPlot
        layers={{
          lines: data,
        }}
        xAxisTitle="date title"
        yAxisTitle="values title"
        marksStyles={marksStyles}
        temporalXAxis
        containerNode={containerRef.current}
      />
    </div>
  );
};

<ResizingPlot />;
```

- Legend component
  - Title
  - Width/height/responsive
- Tooltips
- Date x-axis
- Quantitative x-axis
