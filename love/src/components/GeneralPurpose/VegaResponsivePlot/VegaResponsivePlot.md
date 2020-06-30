Fixed width and height

```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import VegaMiniPlot from '../VegaTimeSeriesPlot/VegaMiniPlot';

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

const legend = names.map((name) => ({
  name,
  label: `${name} label`,
}));

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
  }}
>
  <VegaResponsivePlot layers={{ lines: data }} legend={legend} width={300} height={100} />
</div>;
```

Responsive size

```jsx
import { DateTime } from 'luxon';
import VegaTimeseriesPlot from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import VegaMiniPlot from '../VegaTimeSeriesPlot/VegaMiniPlot';

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

const legend = names.map((name) => ({
  name,
  label: `${name} label`,
}));

const containerRef = React.useRef(undefined);
const [time, setTime] = React.useState(0);
React.useEffect(() => {
  const interval = setInterval(() => {
    setTime((t) => t + 0.01);
  }, 1000/30);
  return () => {
    clearInterval(interval);
  };
}, []);
const width = 450 + 50 * Math.sin(time * Math.PI);
const height = 200 + 10 * Math.sin(time * Math.PI);

<div
  ref={containerRef}
  style={{
    background: 'var(--secondary-background-dimmed-color)',
    width: `${width}px`,
    height: `${height}px`,
  }}
  containerNode={containerRef.current}
>
  <VegaResponsivePlot layers={{ lines: data }} legend={legend} containerNode={containerRef.current} />
</div>;
```
