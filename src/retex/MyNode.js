import React from 'react';
import { Node, Socket, Control } from 'rete-react-render-plugin';
import * as _ from 'lodash';
import DatGui, {
    DatBoolean, DatColor, DatNumber, DatString, DatSelect,
} from 'react-dat-gui';
import typeName from 'type-name';
import 'react-dat-gui/dist/index.css';
import './styles.css';

function Label({ name, align = 'left' }) {
    return (
        <li className="cr text">
            <label style={{ justifyContent: {
                    left: 'flex-start',
                    middle: 'center',
                    right: 'flex-end',
                }[align] }}>
                <span style={{ lineHeight: '25px' }}>
                    {name}
                </span>
            </label>
        </li>
    );
}

function DefaultInput({ name, inputDef: { type, defaultVal, options, controlType }, inputDef, io, ...props }) {
    if (io.connections.length !== 0) return <Label name={name} />

    if (!type) type = typeName(defaultVal);
    if (!controlType) controlType = type;

    if (controlType === 'string') return <DatString path={name} label={name} {...props} />
    if (controlType === 'boolean') return <DatBoolean path={name} label={name} {...props} />
    if (controlType === 'number') {
        const { min, max, step = 0.01 } = inputDef;
        return <DatNumber path={name} label={name} min={min} max={max} step={step} {...props} />
    }
    if (controlType === 'color') return <DatColor path={name} label={name} {...props} />
    if (controlType === 'select') return <DatSelect path={name} label={name} options={options} {...props} />
    return <Label name={name} />
}

function Wrapper({ children, className, onPointerMove, ...props }) {
    return (
        <div className={className} onPointerMove={onPointerMove}>
            {children(props)}
        </div>
    );
}

class MyNode extends Node {
    componentDidMount() {
        const { node } = this.props;
        const initialState = _.fromPairs(_
            .toPairs(node.inputDefs)
            .map(([name, { defaultVal }]) => [name, defaultVal]));
        this.setState({ data: initialState });
    }

    render() {
        const { node, editor, bindSocket, bindControl } = this.props;
        const { data, outputs, controls, inputs /*, selected */ } = this.state;

        return (
            <DatGui
                data={data}
                onUpdate={(newData) => {
                    newData = { ...data, ...newData };
                    for (const key in newData) {
                        const { convert } = node.inputDefs[key];
                        if (convert) newData[key] = convert(newData[key]);
                    }
                    node.data = newData;
                    this.setState({ data: newData });
                    editor.trigger('process');
                }}
                style={{
                    position: 'relative',
                    backgroundColor: '#1A1A1A',
                }}
            >
                <Wrapper>
                    {() => <>
                        <Label name={node.name} align="middle" />
                    </>}
                </Wrapper>
                {outputs.map((output) => (
                    <Wrapper className="retex-port retex-output" key={output.key}>
                        {() => <>
                            <Label name={output.name} align="right" />
                            <Socket type="output" socket={output.socket} io={output} innerRef={bindSocket} />
                        </>}
                    </Wrapper>
                ))}
                {controls.map(control => (
                    <Control className="control" key={control.key} control={control} innerRef={bindControl} />
                ))}
                {inputs.map(input => (
                    <Wrapper className="retex-port retex-input" key={input.key} onPointerMove={(e) => { e.stopPropagation(); }}>
                        {props => <>
                            <Socket type="input" socket={input.socket} io={input} innerRef={bindSocket} />
                            {!input.showControl() && <DefaultInput name={input.name} inputDef={node.inputDefs[input.name]} io={input} {...props} />}
                            {input.showControl() && <Control className="input-control" control={input.control} innerRef={bindControl} />}
                        </>}
                    </Wrapper>
                ))}
            </DatGui>
        )
    }
}

export default MyNode;
