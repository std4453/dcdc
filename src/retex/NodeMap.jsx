import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import MyNode from './MyNode';
import components from "../components";

const useStyles = makeStyles({
    button: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

function NodeMap({ setStep, saveKey, next }) {
    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep(next);
    }, [setStep, next]);
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

    return <>
        <div ref={setRoot} style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
        }}/>
        <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={nextStep}
            classes={{ root: classes.button }}
        >
            下一步
        </Button>
    </>
}

export default NodeMap;
