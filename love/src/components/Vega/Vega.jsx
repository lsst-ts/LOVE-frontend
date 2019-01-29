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

    constructor(){
        super();
        this.vegaContainer = React.createRef();
        this.vegaEmbedResult = null;
        this.minimumX = 0;
        this.state = {
            date: new Date(),
            value: 1
        }
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
                y: { field: 'b', type: 'quantitative' }
            }
        }
    }


    getCSSColorByVariableName = (varName) => {
        return getComputedStyle(this.vegaContainer.current).getPropertyValue(varName);
    }


    newGenerator = () => {
        var counter = -1;
        var previousY = [5, 5, 5, 5];
        return function () {
            counter++;
            const newVal = Math.cos(5*counter*Math.PI/180) + Math.random()*0.5;
            let date = new Date();;
            date = new Date(date.valueOf() + 1000000*counter-17.7*60*60*1000)
            return {
                date: date,
                value: newVal
            };
        };
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
        
        vegae(this.vegaContainer.current, spec).then( (vegaEmbedResult) => {
            let minimumX = 0;
            const valueGenerator =  this.newGenerator();
            this.vegaEmbedResult = vegaEmbedResult;
            window.setInterval( () => {
                const newVal = valueGenerator();
                this.setState({
                    date: newVal.date,
                    value: newVal.value
                });                
            }, 100);
        });



    }

    render() {
        
        if(this.vegaEmbedResult){
            var changeSet = vega
            .changeset()
            .insert({
                date: this.state.date,
                value: this.state.value
            })
            .remove( (t)  => {
                return t.x < this.minimumX;
            });
            this.vegaEmbedResult.view.change(this.props.spec.data.name, changeSet).run();

        }

        return (
            <div ref={this.vegaContainer}></div>
        );
    }
}