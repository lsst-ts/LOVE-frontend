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

    constructor() {
        super();
        this.vegaContainer = React.createRef();
        this.vegaEmbedResult = null;
        this.data = [];
    }

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
                y: { field: 'b', type: 'quantitative' },
            }
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.lastMessageData !== this.props.lastMessageData) {
            if (this.data.length === 0)
                this.remountPlot();

            const dateStart = (new Date()).getTime() - 15 * 1000;
            const dateEnd = new Date();
            const dateOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
            
            this.data.push(...this.props.lastMessageData);
            
            this.data = this.data.filter( (data)=>{
                const date = new Date(data.date) - dateOffset;;
                return date >= dateStart && date <= dateEnd;
            });

            if (this.vegaEmbedResult) {
                
                var changeSet = vega
                    .changeset()
                    .remove(t => true)
                    .insert(this.data)
                this.vegaEmbedResult.view.change(this.props.spec.data.name, changeSet).run();
            }
        }
    }

    getCSSColorByVariableName = (varName) => {
        return getComputedStyle(this.vegaContainer.current).getPropertyValue(varName);
    }

    remountPlot = () => {
        const labelFontSize = 14;
        const titleFontSize = 16;
        const spec = Object.assign({
            "config": {
                "axis": {
                    "labelColor": this.getCSSColorByVariableName('--base-font-color'),
                    "titleColor": this.getCSSColorByVariableName('--base-font-color'),
                    "grid": false,
                },
                "legend": {
                    "labelColor": this.getCSSColorByVariableName('--base-font-color'),
                    "titleColor": this.getCSSColorByVariableName('--base-font-color'),
                    "labelFontSize": labelFontSize,
                    "titleFontSize": titleFontSize,
                    "titleLimit": 160 * titleFontSize,
                    "labelLimit": 15 * labelFontSize,
                },
                "view": {
                    "width": 600,
                },


            },
        }, this.props.spec);

        vegae(this.vegaContainer.current, spec, { renderer: 'svg' }).then((vegaEmbedResult) => {

            let minimumX = 0;
            this.vegaEmbedResult = vegaEmbedResult;
        });
    }

    componentDidMount() {
        this.remountPlot();
    }

    render() {
        if (this.vegaEmbedResult) {
            const timeWindowStart = (new Date()).getTime() - 30 * 1000;
            const dateOffset = (new Date()).getTimezoneOffset() * 60 * 1000;

            var changeSet = vega
                .changeset()
                .insert(this.props.lastMessageData)
            this.vegaEmbedResult.view.change(this.props.spec.data.name, changeSet).run();
        }

        return (
            <div ref={this.vegaContainer}></div>
        );
    }
}