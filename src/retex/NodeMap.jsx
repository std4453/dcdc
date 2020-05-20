import React, { useEffect, useState, useMemo } from 'react';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import MyNode from './MyNode';
import components from "../components";

function NodeMap({ saveKey }) {
    const [root, setRoot] = useState(null);
    const editor = useMemo(() => {
        if (!root) return null;
        return new Rete.NodeEditor('dcdc@0.1.0', root);
    }, [root]);
    useEffect(() => {
        if (!editor) return;
        (async () => {
            editor.use(ConnectionPlugin);
            editor.use(ReactRenderPlugin, { component: MyNode });
            editor.use(ContextMenuPlugin);
            components.forEach(component => editor.register(new component()));

            if (localStorage[saveKey]) {
                try {
                    const data = JSON.parse(localStorage[saveKey]);
                    await editor.fromJSON(data);
                } catch (e) {
                    console.log(e);
                }
            }

            let lastData = null;
            editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
                const data = await editor.toJSON();
                lastData = data;
                setTimeout(() => {
                    if (data !== lastData) return;
                    localStorage[saveKey] = JSON.stringify(data);
                    console.log('Data saved!');
                }, 3000);
            });
        })();
    }, [editor, saveKey]);

    return (
        <div ref={setRoot} style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
        }}/>
    )
}

export default NodeMap;
