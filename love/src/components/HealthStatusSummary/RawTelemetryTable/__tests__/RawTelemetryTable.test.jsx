import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
    getByTestId,
} from 'react-testing-library';
import React from 'react';
import RawTelemetryTable from '../RawTelemetryTable';
import 'jest-dom/extend-expect'


const telemetries = {
    "interestedProposal": {
        "parameters": {
            "numProposals": 1,
            "observationId": 1,
            "proposalBonuses": [0.16462288995478935, 0.5090434127555551, 0.8307461654932169, 0.8445982799617244, 0.9556401710047736, 0.8507407212456454, 0.8163477067969236, 0.5217352327181559, 0.7782177658316023, 0.5861562008747031],
            "proposalBoosts": [0.09664417766339506, 0.033518631944951416, 0.20444526851221112, 0.08670128270663024, 0.8787126462531891, 0.43968473761466964, 0.40645729069661785, 0.012364308693781356, 0.6057605559378251, 0.8847129472428066],
            "proposalIds": [1, 0, 0, 1, 0, 0, 1, 0, 1, 1],
            "proposalNeeds": [0.24168046106631547, 0.15626412016525193, 0.9936280525594118, 0.746124390659442, 0.1364127966294938, 0.6927412661019059, 0.15467899528639917, 0.771337051743795, 0.3759925033385543, 0.7518263846235148],
            "proposalValues": [0.6487926408245908, 0.4899870217488411, 0.9603980073758785, 0.7333348655547495, 0.16179388958587648, 0.6409817456207204, 0.6887419477946592, 0.45895219050622227, 0.5027582332560068, 0.9131818706015618]
        },
        "receptionTimestamp": "2019/01/15 19:43:40"
    },
    "bulkCloud": {
        "parameters": {
            "bulkCloud": 0.423063279336224,
            "timestamp": 0.8259362694208279
        },
        "receptionTimestamp": "2019/01/15 19:43:40"
    },
    "avoidanceRegions": {
        "parameters": {
            "avoidanceRegions": 0,
            "scale": 0.7225105166435242,
            "timestamp": 0.26557864164532263,
            "zero": 0.2302217036485672
        },
        "receptionTimestamp": "2019/01/15 19:43:40"
    }
};
const filters = {
    'component': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'stream': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'timestamp': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'param_name': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'data_type': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'value': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'units': { 'type': 'regexp', 'value': (new RegExp('(?:)')) },
    'health_status': { 'type': 'health', 'value': (new RegExp('(?:)')) },
};

const healthFunctions = {
    'timestamp0': '//asdasdadsa',
    'altitude_decel0': '//dsasdssa\nreturn ALERT;',
    'altitude_accel0': 'return WARNING;',
    'altitude_maxspeed0': 'return OK;',
};

describe('GIVEN a current list of telemetries in the table', () => {

    const table = render(<RawTelemetryTable
        telemetries={telemetries}
        filters={filters}
        healthFunctions={healthFunctions} />);

    const {getByAltText, getByTestId} = table;

    describe("WHEN the user clicks a checkbox on a specific row", () => {
        let checkBox = getByAltText('select scheduler-bulkCloud-bulkCloud');
        fireEvent.click(checkBox);


        it("THEN adds the telemetry to the box", async () => {
            const selectedTelemetries = await waitForElement(()=>getByTestId("selected-telemetries"));

            expect(getByTestId('selected-telemetries')).toHaveTextContent('bulkCloud');
        });
    });
})