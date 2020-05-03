import Rete from 'rete';
import typeName from 'type-name';
import * as _ from 'lodash';

import sockets from './sockets';

class BeanComponent extends Rete.Component {
    constructor(name, inputDefs, outputDefs, initTask) {
        super(name);
        this.inputDefs = inputDefs;
        this.outputDefs = outputDefs;
        this.task = {
            outputs: _.fromPairs(_.toPairs(this.outputDefs).map(
                ([key, { type }]) => [key, type === 'continuation' ? 'option' : 'output']
            )),
            init(task) {
                if (initTask) initTask(task, this);
            },
        };
    }
    
    builder(node) {
        node.inputDefs = _.cloneDeep(this.inputDefs);
        for (const key of Object.keys(node.inputDefs)) {
            if (key in node.data) node.inputDefs[key].defaultVal = node.data[key];
        }
        node.outputDefs = this.outputDefs;
        
        for (let [name, { type, defaultVal, displayName = name }] of _.toPairs(this.inputDefs)) {
            if (!type) type = typeName(defaultVal);
            if (name in node.data) defaultVal = node.data[name];
            const input = new Rete.Input(name, displayName, sockets[type]);
            if (!(name in node.data)) {
                node.data[name] = defaultVal;
            }
            node.addInput(input);
        }
        for (const [name, { type, displayName = name }] of _.toPairs(this.outputDefs)) {
            const output = new Rete.Output(name, displayName, sockets[type]);
            node.addOutput(output);
        }
        return node;
    }

    async worker(node, inputs, data) {
        // console.log(node);
        const inputVals = {};
        for (const [name, { required }] of _.toPairs(this.component.inputDefs)) {
            if (!(name in inputs)) inputs[name] = [];
            if (required && inputs[name].length === 0) return;
            const value = inputs[name].length
                ? (inputs[name][0])
                : node.data[name];
            inputVals[name] = value;
        }

        return await this.component.exec.call(this, inputVals, data);
    }
}

export { BeanComponent };
