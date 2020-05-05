import React from 'react';
import { Node, Socket, Control } from 'rete-react-render-plugin';
import * as _ from 'lodash';
import ControlPanel, {
    Checkbox, Text, Color, Range, Select,
} from 'react-control-panel';
import typeName from 'type-name';
import './styles.css';

function Label({ name, align = 'left' }) {
    return (
        <div className="container">
            <div style={{ textAlign: align }}>
                <span style={{ verticalAlign: 'sub', color: 'rgb(235, 235, 235) '}}>
                    {name}
                </span>
            </div>
        </div>
    );
}

function DefaultInput({ name, inputDef: { type, defaultVal, options, controlType }, inputDef, io }) {
    if (io.connections.length !== 0) return <Label name={name}/>

    if (!type) type = typeName(defaultVal);
    if (!controlType) controlType = type;
    
    if (controlType === 'string') return <Text label={name}/>
    if (controlType === 'boolean') return <Checkbox label={name}/>
    if (controlType === 'number') {
        const { min, max, step = 0.01 } = inputDef;
        return <Range label={name} min={min} max={max} step={step}/>
    }
    if (controlType === 'color') return <Color label={name} format="rgb"/>
    if (controlType === 'select') return <Select label={name} options={options}/>
    return <Label name={name}/>
}

class MyNode extends Node {
    render() {
        const { node, editor, bindSocket, bindControl } = this.props;
        const { outputs, controls, inputs, selected } = this.state;

        const initialState = _.fromPairs(_
            .toPairs(node.inputDefs)
            .map(([name, { defaultVal }]) => [name, defaultVal]));

        return (
            <ControlPanel
                theme="dark"
                title={node.name}
                initialState={initialState}
                onChange={(key, value) => {
                    const { convert } = node.inputDefs[key];
                    node.data[key] = convert ? convert(value) : value;
                    editor.trigger('process');
                }}
                width={300}
                style={{ marginRight: 30 }}
            > 
                {outputs.map((output) => (
                    <div className="retex-port retex-output" key={output.key}>
                        <Label name={output.name} align="right"/>
                        <Socket type="output" socket={output.socket} io={output} innerRef={bindSocket} />
                    </div>
                ))}
                {controls.map(control => (
                    <Control className="control" key={control.key} control={control} innerRef={bindControl} />
                ))}
                {inputs.map(input => (
                    <div className="retex-port retex-input" key={input.key} onPointerMove={(e) => { e.stopPropagation(); }}>
                        <Socket type="input" socket={input.socket} io={input} innerRef={bindSocket} />
                        {!input.showControl() && <DefaultInput name={input.name} inputDef={node.inputDefs[input.name]} io={input}/>}
                        {input.showControl() && <Control className="input-control" control={input.control} innerRef={bindControl} />}
                    </div>
                ))}
            </ControlPanel>
        )
    }
}

export default MyNode;
