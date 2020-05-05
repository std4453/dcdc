import toposort from 'toposort';
import * as _ from 'lodash';

class Engine {
    constructor(id) {
        this.id = id;
        this.components = {};
    }

    register(component) {
        this.components[component.name] = component;
    }

    async abort() {
        // TODO: implement this
    }

    async process({ nodes }, data) {
        const graph = [];
        for (const [_, { id: srcId, outputs }] of _.toPairs(nodes)) {
            for (const [_, { connections }] of _.toPairs(outputs)) {
                for (const { node: dstId } of connections) {
                    graph.push([srcId, dstId]);
                }
            }
        }
        try {
            const keys = toposort(graph);
            await this.run(nodes, keys, 0, {}, data);
        } catch (e) {
            // circular dependency
            console.log(e);
        }
    }

    findNode(nodes, id) {
        return _
            .toPairs(nodes)
            .map(([_, node]) => node)
            .find(({ id: nodeId }) => nodeId === id);
    }

    async run(nodes, keys, ind, values, data) {
        if (ind >= keys.length) return;
        const id = keys[ind];
        const node = this.findNode(nodes, id);
        if (!node) throw new Error('node not found');
        const { inputs, name } = node;
        const inputVals = _.clone(node.data);
        for (const [key, { connections }] of _.toPairs(inputs)) {
            if (connections.length === 0) continue;
            const [{ node: srcId, output }] = connections;
            inputVals[key] = values[srcId][output];
        }
        const component = this.components[name];
        const it = component.worker.call(component, inputVals, node, data);
        for await (const outputVals of it) {
            values[id] = outputVals;
            await this.run(nodes, keys, ind + 1, values);
        }
    }
}

export default Engine;
