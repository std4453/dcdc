import Engine from './engine';
import components from "../components";

export default async (graph, inputs) => {
    const engine = new Engine('dcdc@0.1.0');
    for (const Component of components) {
        engine.register(new Component());
    }
    const ctx = {
        inputs,
        outputs: {},
    };
    await engine.process(graph, ctx);
    return ctx.outputs;
};
