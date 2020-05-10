import React from 'react';
import { Node, Socket, Control } from 'rete-react-render-plugin';
import * as _ from 'lodash';
import DatGui, {
    DatBoolean, DatColor, DatNumber, DatString, DatPresets, DatFolder
} from 'react-dat-gui';
import typeName from 'type-name';
import 'react-dat-gui/dist/index.css';
import './styles.css';

function Label({ name, align = 'left' }) {
    return (
        <li className="cr">
            <label style={{ justifyContent: { left: 'flex-start', right: 'flex-end' }[align] }}>
                <span style={{ lineHeight: '27px' }}>
                    {name}
                </span>
            </label>
        </li>
    );
}

function DefaultInput({ name, inputDef: { type, defaultVal, options, controlType }, inputDef, io }) {
    if (io.connections.length !== 0) return <Label name={name} />

    if (!type) type = typeName(defaultVal);
    if (!controlType) controlType = type;

    if (controlType === 'string') return <DatString path={name} label={name} />
    if (controlType === 'boolean') return <DatBoolean path={name} label={name} />
    if (controlType === 'number') {
        const { min, max, step = 0.01 } = inputDef;
        return <DatNumber path={name} label={name} min={min} max={max} step={step} />
    }
    if (controlType === 'color') return <DatColor label={name} format="rgb" />
    if (controlType === 'select') return <DatPresets label={name} options={options} />
    return <Label name={name} />
}

class MyNode extends Node {
    render() {
        const { node, editor, bindSocket, bindControl } = this.props;
        const { outputs, controls, inputs, selected } = this.state;

        const initialState = _.fromPairs(_
            .toPairs(node.inputDefs)
            .map(([name, { defaultVal }]) => [name, defaultVal]));
        console.log(initialState);

        return (
            <DatGui
                data={initialState}
                onUpdate={(newData) => {
                    newData = { ...newData, ...node.data };
                    for (const key in newData) {
                        const { convert } = node.inputDefs[key];
                        if (convert) newData[key] = convert(newData[key]);
                    }
                    node.data = newData;
                    editor.trigger('process');
                }}
                style={{
                    position: 'relative',
                    backgroundColor: '#1A1A1A',
                }}
            >
                {outputs.map((output) => (
                    <div className="retex-port retex-output" key={output.key}>
                        <Label name={output.name} align="right" />
                        <Socket type="output" socket={output.socket} io={output} innerRef={bindSocket} />
                    </div>
                ))}
                {controls.map(control => (
                    <Control className="control" key={control.key} control={control} innerRef={bindControl} />
                ))}
                {inputs.map(input => (
                    <div className="retex-port retex-input" key={input.key} onPointerMove={(e) => { e.stopPropagation(); }}>
                        <Socket type="input" socket={input.socket} io={input} innerRef={bindSocket} />
                        {!input.showControl() && <DefaultInput name={input.name} inputDef={node.inputDefs[input.name]} io={input} />}
                        {input.showControl() && <Control className="input-control" control={input.control} innerRef={bindControl} />}
                    </div>
                ))}
            </DatGui>
        )
    }
}

export default MyNode;
