import React, { Component } from 'react';
import * as vegal from 'vega-lite';
import * as vega from 'vega';
import vegae from 'vega-embed';

export default class Vega extends Component {

    static defaultProps = {
        spec: {
            $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
            description: 'A simple bar chart with embedded data.',
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
                    { a: 'I', b: 52 }
                ]
            },
            mark: 'bar',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { field: 'b', type: 'quantitative' }
            }
        }
    }

    vegaContainer = React.createRef();

    componentDidMount() {
        vegae(this.vegaContainer.current, this.props.spec);
    }

    render() {
        return (
            <div ref={this.vegaContainer}></div>
        );
    }
}