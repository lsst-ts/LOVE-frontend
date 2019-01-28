import React, { Component } from 'react';
import * as vegal from 'vega-lite';
import * as vega from 'vega';
import vegae from 'vega-embed';
import PropTypes from 'prop-types';

/**
 * Simple wrapper around the Vega-lite visualization package.
 * It receives the plot spec and embeds the plot in the DOM using React refs. 
 */
export default class Vega extends Component {
    static propTypes = {
        /**
         * Object that defines the properties to be used by Vega-lite
         */
        spec: PropTypes.object
    }

    static defaultProps = {
        spec: {
            $schema: 'https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json',
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

    getCSSColorByVariableName = (varName) => {
        return getComputedStyle(this.vegaContainer.current).getPropertyValue(varName);
    }

    componentDidMount() {

        // check https://vega.github.io/vega/docs/config/ for more config options
        const spec = Object.assign({
         "config":{
             "axis":{
                 "labelColor" : this.getCSSColorByVariableName('--base-font-color'),
                 "titleColor" : this.getCSSColorByVariableName('--base-font-color'),
             }
         }   
        }, this.props.spec);
        
        vegae(this.vegaContainer.current, spec);
    }

    render() {
        return (
            <div ref={this.vegaContainer}></div>
        );
    }
}