const flowPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const temperatureSupplyPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const temperatureReturnPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const pressureSupplyPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const pressureReturnPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

function GlycolPlots() {
  return (
    <div className={styles.glycolPlotsContainer}>
      <div className={[styles.plotContainer, styles.wide].join(' ')}>
        <div className={styles.highlight}>Glycol Flow</div>
        <div className={styles.plot}>
          <PlotContainer inputs={flowPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Temperature In</div>
        <div className={styles.plot}>
          <PlotContainer
            inputs={temperatureSupplyPlotInputs}
            controls={false}
            legendPosition="bottom"
            xAxisTitle="Time"
          />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Temperature Out</div>
        <div className={styles.plot}>
          <PlotContainer
            inputs={temperatureReturnPlotInputs}
            controls={false}
            legendPosition="bottom"
            xAxisTitle="Time"
          />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Pressure In</div>
        <div className={styles.plot}>
          <PlotContainer inputs={pressureSupplyPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Pressure Out</div>
        <div className={styles.plot}>
          <PlotContainer inputs={pressureReturnPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
    </div>
  );
}
