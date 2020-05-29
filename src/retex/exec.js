import Engine from './engine';
import components from "../components";

export default async (graph, data) => {
    const engine = new Engine('dcdc@0.1.0');
    for (const Component of components) {
        engine.register(new Component());
    }
    await engine.process(graph, data);
};
