import "@babel/polyfill";

import React, { useState, useCallback, useEffect } from 'react';
import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import * as _ from 'lodash';
import typeName from 'type-name';

import { uniform } from './utils';

const width = 1920, height = 1080;
const container = document.querySelector('#container');
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

const sockets = new Proxy({}, {
    get(obj, prop) {
        if (!(prop in obj)) {
            obj[prop] = new Rete.Socket(prop);
        }
        return obj[prop];
    }
});

function NumberControlInner({ id, defaultVal, emitter, putData }) {
    const [value, setValue] = useState(defaultVal);
    useEffect(() => {
        putData(id, value);
        emitter.trigger("process");
    }, [id, value, emitter]);
    const onChange = useCallback(({ target: { value } }) => setValue(value), []);

    return (
        <input value={value} onChange={onChange} type="number" />
    );
}

class NumberControl extends Rete.Control {
    constructor(emitter, key, defaultVal) {
        super(key);
        this.render = 'react';
        this.component = NumberControlInner;
        console.log(this);
        this.props = { emitter, defaultVal, id: key, putData: this.putData.bind(this) };
    }
}

const controls = {
    number: NumberControl,
};

class StandardComponent extends Rete.Component {
    constructor(name, inputDefs, outputDefs) {
        super(name);
        this.inputDefs = inputDefs;
        this.outputDefs = outputDefs;
    }

    builder(node) {
        for (let [name, { type, defaultVal, hasControl = true, displayName = name }] of _.toPairs(this.inputDefs)) {
            if (!type) type = typeName(defaultVal);
            const input = new Rete.Input(name, displayName, sockets[type]);
            node.data[name] = defaultVal;
            if (hasControl && controls[type]) {
                input.addControl(new controls[type](this.editor, name, defaultVal));
            }
            node.addInput(input);
        }
        for (const [name, { type, displayName = name }] of _.toPairs(this.outputDefs)) {
            const output = new Rete.Output(name, displayName, sockets[type]);
            node.addOutput(output);
        }
        return node;
    }

    async worker(node, inputPorts, outputPorts) {
        const inputs = {};
        for (const [name] of _.toPairs(this.inputDefs)) {
            let value = inputPorts[name].length ? (inputs[name][0]) : node.data[name];
            inputs[name] = value;
        }

        const outputs = await this.exec(inputs);
        for (const [name] of _.toPairs(this.outputDefs)) {
            outputPorts[name] = outputs[name];
        }
    }
}

const textWidth = (text, sizes, spacing) => {
    // VERY SIMPLE
    // return size * text.length + spacing * size * (text.length - 1);
    let width = 0;
    for (let i = 0; i < text.length; ++i) {
        width += sizes[i] * (1 + spacing);
    }
    width -= sizes[0] * spacing / 2;
    width -= sizes[text.length - 1] * spacing / 2;
    return width;
}

class FontComponent extends StandardComponent {
    constructor() {
        super(
            "Font",
            {
                text: { defaultVal: '被害妄想携帯女子' },
                x0: { defaultVal: 960 },
                y0: { defaultVal: 540 },
                size: { defaultVal: 90 },
                dir: { defaultVal: 'horizontal' },
                align: { defaultVal: 'begin' },
                color: { defaultVal: '#000000' },
                fontFamily: { defaultVal: 'Hiragino Mincho Pro' },
                fontWeight: { defaultVal: 900 },
                spacing: { defaultVal: 0 },
                ignoreWhitespaces: { defaultVal: true },
                alignBaseline: { defaultVal: true },
                sizeVar: { defaultVal: 0 },
                meanRotate: { defaultVal: 0 },
                rotateVar: { defaultVal: 0 },
            },
            {}
        );
    }

    exec({ text, x0, y0, ...options }) {
        const {
            size, dir, align, color, rotate = 0,
            fontFamily, fontWeight, spacing, ignoreWhitespaces, sizeVar = 0,
            alignBaseline = true,
        } = options;
        if (ignoreWhitespaces) text = text.split(/\s+/).join('');
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(rotate);
        let x = 0, y = 0;
        const sizes = new Array(text.length).fill(0).map(() => size * uniform(1 - sizeVar / 2, 1 + sizeVar / 2));
        const width = textWidth(text, sizes, spacing);
        if (align === 'middle') {
            switch (dir) {
                case 'horizontal':
                    x -= width / 2;
                    break;
                case 'vertical':
                    y -= width / 2;
                    break;
            }
        }
        if (align === 'end') {
            switch (dir) {
                case 'horizontal':
                    x -= width;
                    break;
                case 'vertical':
                    y -= width;
                    break;
            }
        }
        switch (dir) {
            case 'horizontal':
                x += sizes[0] / 2;
                break;
            case 'vertical':
                y += sizes[0] / 2;
                break;
        }
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        text.split('').forEach((ch, i) => {
            ctx.font = `${fontWeight} ${sizes[i]}px \'${fontFamily}\'`;
            const bx = x;
            const by = alignBaseline && dir === 'horizontal' ? y - (sizes[i] - size) / 2 : y;
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(uniform(
                Math.PI / 2 * (options.meanRotate - options.rotateVar),
                Math.PI / 2 * (options.meanRotate + options.rotateVar)));
            ctx.fillText(ch, 0, 0);
            ctx.restore();
            switch (dir) {
                case 'horizontal':
                    x += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
                case 'vertical':
                    y += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
            }
        });
        ctx.restore();
    }
}

const reteContainer = document.querySelector('#rete');
const editor = new Rete.NodeEditor('demo@0.1.0', reteContainer);

editor.use(ConnectionPlugin);
editor.use(ReactRenderPlugin);
editor.use(ContextMenuPlugin);

const fontComponent = new FontComponent();
editor.register(fontComponent);

const engine = new Rete.Engine('demo@0.1.0');
engine.register(fontComponent);

editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
    await engine.abort();
    await engine.process(editor.toJSON());
});