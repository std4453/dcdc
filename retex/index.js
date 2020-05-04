import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import TaskPlugin from 'rete-task-plugin';
import MyNode from './MyNode';
import components from "../components";

export default async () => {
    const editor = new Rete.NodeEditor('dcdc@0.1.0', document.querySelector('#rete'));
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin, { component: MyNode });
    editor.use(ContextMenuPlugin);
    editor.use(TaskPlugin);
    // HACK!!!!
    editor.bind('postprocess');
    Object.keys(editor.events).forEach(key => {
        const onceListeners = [];
        editor.events[key].onceListeners = onceListeners;
        editor.on(key, (...args) => {
            while (onceListeners.length > 0) {
                const listener = onceListeners.pop();
                listener(...args);
            }
        })
    });
    editor.once = (name, fn) => {
        editor.events[name].onceListeners.push(fn);
    };
    
    const engine = new Rete.Engine('dcdc@0.1.0');
    
    components.forEach(component => {
        const instance = new component();
        editor.register(instance);
        engine.register(instance);
    });
    
    if (localStorage['retex']) {
        try {
            const data = JSON.parse(localStorage['retex']);
            await editor.fromJSON(data);
        } catch (e) {
            console.log(e);
        }
    }
    
    let lastData = null;

    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        await engine.abort();
        const data = await editor.toJSON();
        lastData = data;
        await engine.process(data);
        editor.trigger('postprocess');
        setTimeout(() => {
            if (data !== lastData) return;
            localStorage['retex'] = JSON.stringify(data);
            console.log('Data saved!');
        }, 3000);
    });
    editor.trigger('process');
}