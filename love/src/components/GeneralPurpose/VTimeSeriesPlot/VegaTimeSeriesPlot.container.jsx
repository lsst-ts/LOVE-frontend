

import React from 'react';
import { connect } from 'react-redux';
import { addGroup, requestGroupRemoval } from '../../../redux/actions/ws';
import { getStreamsData } from '../../../redux/selectors/selectors.js';
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
            default: {
                'telemetry-ATMCS-0-mount_AzEl_Encoders': {
                    'elevationCalculatedAngle': 'Elevation',
                },
                "telemetry-ATDome-0-position": {
                    'azimuthPosition': 'ATDome azimuth'
                }
            }
        }
    }
}


const defaultStyles = [
    {
        color: "#ff7bb5",
        shape: "circle",
        filled: true,
        dash: [4, 0],
    },
    {
        color: "#ff7bb5",
        shape: "circle",
        filled: false,
        dash: [4, 0],
    },
    {
        color: "#00b7ff",
        shape: "square",
        filled: true,
        dash: [4, 0],
    },
    {
        color: "#00b7ff",
        shape: "square",
        filled: false,
        dash: [4, 0],
    },
    {
        color: "#97e54f",
        shape: "diamond",
        filled: true,
        dash: [4, 0],
    },
    {
        color: "#97e54f",
        shape: "diamond",
        filled: false,
        dash: [4, 0],
    }
];



const VegaTimeSeriesPlotContainer = function ({ subscriptions, streams, subscribeToStreams, unsubscribeToStreams, ...props }) {




    const startDate = moment().subtract(2, 'year').startOf('day');

    const [data, setData] = React.useState([]);

    const names = Object.keys(subscriptions).flatMap(streamName => {
        return Object.keys(subscriptions[streamName]).map(paramName => `${streamName}-${paramName}`);
    });

    const linesStyles = names.map((name, index) => ({ name, ...defaultStyles[index % defaultStyles.length] }));


    React.useEffect(() => {
        subscribeToStreams();
    }, []);

    React.useEffect(() => {

        const newData = names.reduce((prevStreamArray, name) => {
            const splitName = name.split('-');
            const param = splitName[splitName.length - 1];
            const stream = splitName.slice(0, -1).join('-')
            if (!streams?.[stream]?.[param]?.value) {
                return prevStreamArray;
            }

            const { value, ...others } = streams[stream][param];
            prevStreamArray.push({
                name,
                x: moment.unix(streams[stream]?.private_rcvStamp?.value),
                y: Array.isArray(value) ? value[0] : value,
                ...others
            });
            return prevStreamArray;
        }, []);

        if (newData?.length > 0) {
            setData(data => data.concat(newData).slice(-100))
        }

    }, [streams]);


    return (
        <VegaTimeSeriesPlot
            data={data}
            linesStyles={linesStyles}
            units={{ y: "deg" }}
            yAxisTitle={"Telementry"}
            xAxisTitle={"Time ago"}
            temporalXAxis={true}
            skipPointsEvery={1}
        />
    )
}


const mapStateToProps = (state, ownProps) => {
    const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
    const groupNames = Object.keys(subscriptions);

    const streams = getStreamsData(state, groupNames);
    return {
        streams,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        subscribeToStreams: () => {
            const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
            const groupNames = Object.keys(subscriptions);
            console.log('groupNames', groupNames)
            groupNames.forEach((groupName) => {
                dispatch(addGroup(groupName));
            });
        },
        unsubscribeToStreams: () => {
            const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
            const groupNames = Object.keys(subscriptions);
            groupNames.forEach((groupName) => {
                dispatch(requestGroupRemoval(groupName));
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VegaTimeSeriesPlotContainer);


// 'Mount Azimuth': 'telemetry-ATMCS-0-mount_AzEl_Encoders',
// 'Mount Azimuth': (data) => (data.azimuthCalculatedAngle ? data.azimuthCalculatedAngle.value[0] : 0),
