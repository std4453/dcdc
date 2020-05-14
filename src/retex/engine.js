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
        const graph = { inputNodes: {}, inputs: {} };
        for (const [, { id, inputs: nodeInputs }] of _.toPairs(nodes)) {
            graph.inputNodes[id] = [];
            graph.inputs[id] = {};
            const { inputNodes: { [id]: inputNodes }, inputs: { [id]: inputs } } = graph;
            for (const [dkey, { connections }] of _.toPairs(nodeInputs)) {
                if (connections.length === 0) continue;
                const [{ node: nid, output: skey }] = connections;
                if (!inputNodes.includes(nid)) inputNodes.push(nid);
                inputs[dkey] = { id: nid, key: skey };
            }
        }
        try {
            const queue = [];
            queue.push({
                values: {},
                processed: [],
                unprocessed: _.toPairs(nodes).map(([_, { id }]) => id),
            });
            while (queue.length !== 0) {
                const [ctx] = queue.splice(0, 1);
                const it = this.run(nodes, graph, ctx, data);
                for await (const newCtx of it) queue.push(newCtx);
            }
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

    async * run(nodes, graph, { processed, unprocessed, values }, data) {
        const { inputNodes, inputs } = graph;
        // find reachable node
        const nid = unprocessed.find(id => inputNodes[id].every(iid => iid in values));
        if (nid === undefined) throw new Error('no reachable node');
        // collect inputs
        const node = this.findNode(nodes, nid);
        if (!node) throw new Error('unable to find node');
        const { name, data: nodeData } = node;
        const inputVals = _.clone(nodeData);
        for (const [dkey, { id: sid, key: skey }] of _.toPairs(inputs[nid])) {
            inputVals[dkey] = values[sid][skey];
        }
        // get outputs
        const component = this.components[name];
        const it = component.worker.call(component, inputVals, node, data);
        for await (const outputVals of it) {
            yield {
                processed: [...processed, nid],
                unprocessed: unprocessed.filter(id => id !== nid),
                values: { ...values, [nid]: outputVals },
            };
        }
    }
}

export default Engine;
