import Rete from 'rete';
import typeName from 'type-name';
import * as _ from 'lodash';

import sockets from './sockets';

class BeanComponent extends Rete.Component {
    constructor(name, inputDefs, outputDefs) {
        super(name);
        this.inputDefs = inputDefs;
        this.outputDefs = outputDefs;
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
}

export { BeanComponent };
