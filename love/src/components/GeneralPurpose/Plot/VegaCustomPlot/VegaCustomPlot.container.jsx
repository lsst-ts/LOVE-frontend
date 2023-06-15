import React from 'react';
import { connect } from 'react-redux';
// import { addGroup, requestGroupRemoval } from 'redux/actions/ws';
// import { getStreamsData } from 'redux/selectors/selectors';
import VegaCustomPlot from './VegaCustomPlot';

export const schema = {
  description: 'Plots Vega-Lite JSON Schemas',
  defaultSize: [8, 8],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: true,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: true,
      default: 'Time series plot',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    schema: {
      type: 'object',
      description: 'Vega-Lite JSON Schema',
      isPrivate: false,
      default: {
        description: 'A simple bar chart with embedded data.',
        config: {
          background: null,
          title: { color: '#ddd' },
          style: {
            'guide-label': {
              fill: '#ddd',
            },
            'guide-title': {
              fill: '#ddd',
            },
          },
          axis: {
            domainColor: '#626262',
            gridColor: '#424242',
            tickColor: null,
          },
          axisX: {
            titlePadding: 16,
            titleFontWeight: 750,
            labelFontWeight: 750,
            tickCount: 5,
          },
        },
        data: {
          values: [
            { a: 'A', b: 28 },
            { a: 'B', b: 55 },
            { a: 'C', b: 43 },
            { a: 'D', b: 91 },
            { a: 'E', b: 81 },
            { a: 'F', b: 53 },
            { a: 'G', b: 19 },
            { a: 'H', b: 87 },
            { a: 'I', b: 52 },
          ],
        },
        mark: 'bar',
        encoding: {
          x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
          y: { field: 'b', type: 'quantitative' },
        },
        width: 400,
        height: 200,
      },
    },
  },
};

class PlotContainer extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  render() {
    const { schema, containerNode, width, height } = this.props;

    const plotProps = { schema, width, height };
    if (!width && !height && !containerNode) {
      return (
        <div ref={this.containerRef} style={{ height: '100%', width: '100%', overflow: 'auto' }}>
          <VegaCustomPlot {...plotProps} containerNode={this.containerRef} />
        </div>
      );
    }

    return <VegaCustomPlot {...plotProps} containerNode={containerNode} />;
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotContainer);
