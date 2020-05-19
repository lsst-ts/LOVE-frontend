

import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
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



const VegaTimeSeriesPlotContainer = function ({ subscriptions, streams, subscribeToStreams, unsubscribeToStreams, ...props }) {
    console.log('subscriptions', subscriptions)
    const startDate = moment().subtract(2, 'year').startOf('day');

    const [data, setData] = React.useState([]);



    const names = ['test data'];
    const linesStyles = [
        { name: names[0] }
    ]



    React.useEffect(() => {
        subscribeToStreams();
    }, []);

    React.useEffect(() => {

        const newData = Object.keys(streams).reduce((prevStreamArray, streamName) => {
            if (!Object.keys(subscriptions).includes(streamName)) {
                return;
            }

            if (!streams[streamName]?.private_rcvStamp?.value) {
                return;
            }

            Object.keys(subscriptions[streamName]).forEach((paramName) => {
                if (!Object.keys(subscriptions[streamName]).includes(paramName)) {
                    return;
                }

                if (!streams[streamName]?.[paramName]?.value) {
                    return;
                }
                const { value, ...others } = streams[streamName][paramName];
                prevStreamArray.push({
                    name: `${streamName}-${paramName}`,
                    x: moment.unix(streams[streamName]?.private_rcvStamp?.value),
                    y: Array.isArray(value) ? value[0] : value,
                    ...others
                })
            });

            return prevStreamArray;
        }, [])

        if (newData?.length > 0) {
            setData(data => data.concat(newData).slice(-100))
        }

    }, [streams]);


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
                dispatch(addGroupSubscription(groupName));
            });
        },
        unsubscribeToStreams: () => {
            const subscriptions = ownProps.subscriptions || schema.props.subscriptions.default;
            const groupNames = Object.keys(subscriptions);
            groupNames.forEach((groupName) => {
                dispatch(requestGroupSubscriptionRemoval(groupName));
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VegaTimeSeriesPlotContainer);


// 'Mount Azimuth': 'telemetry-ATMCS-0-mount_AzEl_Encoders',
// 'Mount Azimuth': (data) => (data.azimuthCalculatedAngle ? data.azimuthCalculatedAngle.value[0] : 0),
