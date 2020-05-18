import React from 'react';
import VegaTimeSeriesPlot from './VegaTimeSeriesPlot';

export const schema = {
    description: "vega plot",
    defaultSize: [8,8],
    props: {}
}

export default function(){
    return <VegaTimeSeriesPlot/>
}