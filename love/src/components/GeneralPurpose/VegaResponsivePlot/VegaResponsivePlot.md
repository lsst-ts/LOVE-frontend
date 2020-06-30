Render many lines with custom styles with an automatic and responsive legend layout

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

const legend = names.map(name => ({
    name,
    label: `${name} label`
}));

<div
  style={{
    background: 'var(--secondary-background-dimmed-color)',
  }}
>
  <VegaResponsivePlot layers={{ lines: data }} legend={legend} />
</div>;
```
