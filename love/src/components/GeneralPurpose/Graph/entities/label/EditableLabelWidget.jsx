import * as React from 'react';

import { EditableLabelModel } from './EditableLabelModel';
import styled from '@emotion/styled';

// export interface FlowAliasLabelWidgetProps {
//     model: EditableLabelModel;
// }

const Label = ({ children }) => {
// 	// NOTE: this CSS rules allows to interact with elements in label
    return (<div style={{
        userSelect: 'none',
        pointerEvents: 'auto'
    }}>
        {children}
    </div>)
}

// now we can render all what we want in the label
export const EditableLabelWidget = (props) => {
    const [str, setStr] = React.useState(props.model.value);

    console.log('widget')
    return (
        <Label>
            <input
                value={str}
                onChange={(event) => {
                    const newVal = event.target.value;

                    // update value both in internal component state
                    setStr(newVal);
                    // and in model object
                    props.model.value = newVal;
                }}
            />

            <button onClick={() => console.log('model eventDidFire')}>Click me!</button>
        </Label>
    );
};
