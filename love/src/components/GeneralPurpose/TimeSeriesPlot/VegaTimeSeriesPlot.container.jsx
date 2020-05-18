

import React from 'react';
import VegaTimeSeriesPlot from './VegaTimeSeriesPlot';
import moment from 'moment';


export const schema = {
    description: "vega plot",
    defaultSize: [8, 8],
    props: {
        titleBar: {
            type: 'boolean',
            description: 'Whether to display the title bar',
            isPrivate: false,
            default: true,
        },
        title: {
            type: 'string',
            description: 'Name diplayed in the title bar (if visible)',
            isPrivate: false,
            default: 'Time series plot',
        },
        hasRawMode: {
            type: 'boolean',
            description: 'Whether the component has a raw mode version',
            isPrivate: true,
            default: true,
        },
        subscriptions: {
            type: 'array',
            description: 'lits of subscriptions',
            isPrivate: false,
            default: [
                'telemetry-ATDome-0-position'
            ]
        }
    }
}


const props = {
    data: new Array(10).fill(1).flatMap((e, index) => [
        {
            name: "dome-1",
            index: 0,
            x: 0 + index * 325,
            y: 731.8853820597765,
        },
        {
            name: "dome-1",
            index: 32,
            x: 321.3190234103885 + index * 325,
            y: 841.4329524302399,
        },
        {
            name:
                "ATMCS.2",
            index: 13,
            x: 65 + index * 390,
            y: 232.8850183373796,
        },
        {
            name:
                "ATMCS.2",
            index: 45,
            x: 225.00224166312543 + index * 390,
            y: 431.5274682630082,
        },
        {
            name:
                "ATMCS.2",
            index: 77,
            x: 385 + index * 390,
            y: 437.9825160809631,
        },
    ]),
    data2: [
        {
            name: "dome-1",
            index: 0,
            x: moment('2019-01-01'),
            y: 731.8853820597765,
        },
        {
            name: "dome-1",
            index: 32,
            x: moment('2019-04-01'),
            y: 841.4329524302399,
        },
        {
            name:
                "ATMCS.2",
            index: 13,
            x: moment('2019-07-01'),
            y: 232.8850183373796,
        },
        {
            name:
                "ATMCS.2",
            index: 45,
            x: moment('2019-10-01'),
            y: 431.5274682630082,
        },
        {
            name:
                "ATMCS.2",
            index: 77,
            x: moment('2020-01-01'),
            y: 437.9825160809631,
        },
    ],
    horizontalLinesData: [
        {
            value: 120.00000000,
            name: "nombre-3",
            kind: "cota-instalacion",
        },
        {
            value: 500.00000000,
            name: "otronombre-1",
            kind: null,
        },
        {
            value: 600.00000000,
            name: "otronombre-2",
            kind: null,
        },
        {
            value: 820.00000000,
            name: "otronombre-1",
            kind: null,
        },
    ],
    barsData: [
        {
            x: 400,
            y: 200,
            name: 'bar1'
        },
        {
            x: 800,
            y: 400,
            name: 'bar1'
        },
        {
            x: 2000,
            y: 600,
            name: 'bar2'
        },
        {
            x: 2400,
            y: 300,
            name: 'bar2'
        },
        {
            x: 1400,
            y: 300,
            name: 'bar3'
        }
    ],
    rectanglesData: [
        {
            x: 400,
            x2: 620,
            name: 'rect1'
        },
        {
            x: 1100,
            x2: 1300,
            name: 'rect2'
        },
        {
            x: 3300,
            x2: 4000,
            name: 'rect3'
        }
    ],
    linesStyles: [
        {
            color: "#ff7bb5",
            shape: "circle",
            filled: true,
            dash: [4, 0],
            name: "dome-1",
        },
        {
            color: "#ff7bb5",
            shape: "circle",
            filled: false,
            dash: [4, 0],
            name:
                "ATMCS.2",
        },
        {
            color: "#00b7ff",
            shape: "square",
            filled: true,
            dash: [4, 0],
            name: "nombre-3",
        },
        {
            color: "#00b7ff",
            shape: "square",
            filled: false,
            dash: [4, 0],
            name: "otronombre-1",
        },
        {
            color: "#97e54f",
            shape: "diamond",
            filled: true,
            dash: [4, 0],
            name: "otronombre-2",
        },
        {
            color: "#97e54f",
            shape: "diamond",
            filled: false,
            dash: [4, 0],
            name: "otronombre-1",
        },
        {
            color: "#97e54f",
            name: "bar1",
            markType: 'bar'
        },
        {
            color: "#f9b200",
            name: "bar2",
            markType: 'bar'
        },
        {
            color: "#a9a5ff",
            name: "bar3",
            markType: 'bar'
        }
    ],
};


export default function () {

    const startDate = moment().subtract(2, 'year').startOf('day');

    const data = new Array(100).fill(0).map((v, index) => ({
        name: 'test data',
        x: startDate.add(index, 'day')
    }));

    const names = ['test data'];
    const linesStyles = [
        { name: names[0] }
    ]

    // return <VegaTimeSeriesPlot
    //     data={data}
    //     temporalXAxis={true}
    //     names={names}
    //     linesStyles={linesStyles} />

    return (
        <VegaTimeSeriesPlot
            data={props.data}
            linesStyles={props.linesStyles}
            units={{ y: "deg" }}
            yAxisTitle={"Telementry"}
            xAxisTitle={"Time ago"}
            temporalXAxis={true}
            skipPointsEvery={1}
        />
    )
}