import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import components from "./components";

export default () => {
    const editor = new Rete.NodeEditor('dcdc@0.1.0', document.querySelector('#rete'));
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin);

    const engine = new Rete.Engine('dcdc@0.1.0');

    components.forEach(component => {
        const instance = new component();
        editor.register(instance);
        engine.register(instance);
    });

    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
    });
}