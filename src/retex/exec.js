import Engine from './engine';
import components from "../components";

export default async (saveKey, data) => {
    const dataStr = localStorage[saveKey];
    const graph = JSON.parse(dataStr);
    const engine = new Engine('dcdc@0.1.0');
    for (const Component of components) {
        engine.register(new Component());
    }
    await engine.process(graph, data);
};
