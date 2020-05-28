import * as _ from 'lodash';
import toposort from 'toposort';

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
        // step 1: topo sort
        const nodes = [];
        const edges = [];
        for (const [, { id, inputs: nodeInputs }] of _.toPairs(nodes)) {
            nodes.push(id);
            for (const [, { connections }] of _.toPairs(nodeInputs)) {
                if (connections.length === 0) continue;
                // only one connection is supported here
                const [{ node: nid }] = connections;
                edges.push([nid, id]);
            }
        }
        const order = toposort.array(nodes, edges);

        // step 2: sort nodes accordingly
        const inversed = _.toPairs(order.map((id, i) => [id, i]));
        const sorted = _.values(nodes).sort(({ id: id1, id: id2 }) => inversed[id1] - inversed[id2]);

        // step 3: execution
        const results = {};
        for (let i = 0; i < sorted.length; ++i) {
            const { name, id, inputs: nodeInputs, data: defaults } = sorted[i];

            // step 3.1: collect routes
            // data at root block will be pushed to every leaf node
            const routesMap = { data: { ...defaults } };
            for (const [dkey, { connections }] of _.toPairs(nodeInputs)) {
                if (connections.length === 0) continue;
                const [{ node: nid, key: skey }] = connections;
                // since we execute nodes in topologically-sorted order, all nodes that this node
                // depends on should have already been executed
                for (const { path: _path, result: { [skey]: input } } of results[nid]) {
                    const path = [..._path]; // avoid editing original path by copying
                    // current node at #i, so there should be i nodes before it, thus path length should be i
                    // we fill the missing indices with -1 (meaning default).
                    while (path.length < i) path.push(-1);
                    const pathStr = path.map(idx => `_${idx}`).join('.');
                    // there is a pitfall here that for the first node, the pathStr will be '', while _.has({}, '')
                    // returns false, however it will not be a problem since the first node must have no dependencies,
                    // so its nodeInputs should empty, and this part will not be reached at all.
                    if (!_.has(routesMap, pathStr)) _.set(routesMap, pathStr, { data: {} });
                    const { data } = _.get(routesMap, pathStr);
                    data[dkey] = input;
                }
            }

            // step 3.2: cartesian product over all possible routes
            const product = (obj) => {
                // push data to all children, thus pushing data to all leaf blocks in the end
                for (const key in obj) {
                    if (!key.startsWith('_')) continue;
                    // data of descendants override that of parent
                    obj[key].data = { ...obj.data, ...obj[key].data };
                    product(obj[key]);
                }
            };
            product(routesMap);

            // step 3.3: collect routes after product
            const routes = [];
            // traverse object recursively until the given depth is reached
            const collect = (obj, path, levels) => {
                if (levels === 0) routes.push({ path: [...path], result: {...obj.data } });
                for (const key in obj) {
                    if (!key.startsWith('_')) continue;
                    const idx = parseInt(key.substring(1));
                    collect(obj[key], [...path, idx], levels - 1);
                }
            };
            collect(routesMap, [], i);

            // step 3.4: filter routes
            const keys = _.keys(nodeInputs);
            const filtered = routes.filter(({ result }) => {
                // only routes that has all the inputs are accepted, this allows components
                // to omit an output and disable the socket, dynamically
                for (const key of keys) if (!(key in result)) return false;
                return true;
            });

            // step 3.5: execution
            const component = this.components[name];
            results[id] = [];
            for (const { path, result } of filtered) {
                const it = component.worker.call(component, result, node, data);
                let idx = 0;
                for await (const outputVals of it) {
                    results[id].push({
                        path: [...path, idx],
                        result: outputVals,
                    });
                    ++idx;
                }
            }
        }
    }
}

export default Engine;
