import Rete from 'rete';
import typeName from 'type-name';
import * as _ from 'lodash';

import controls from './controls';
import sockets from './sockets';

class BeanComponent extends Rete.Component {
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
        for (const [name, { required }] of _.toPairs(this.inputDefs)) {
            if (required && inputPorts[name].length === 0) return;
            const value = inputPorts[name].length ? (inputPorts[name][0]) : node.data[name];
            inputs[name] = value;
        }

        const outputs = await this.exec(inputs);
        for (const [name] of _.toPairs(this.outputDefs)) {
            outputPorts[name] = outputs[name];
        }
    }
}

export { BeanComponent };
