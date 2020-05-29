import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { makeStyles, Button, Grid } from '@material-ui/core';
import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { saveAs } from 'file-saver';
import ReactFileReader from 'react-file-reader';
import { readAsText } from 'promise-file-reader';
import MyNode from './MyNode';
import components from "../components";

const useStyles = makeStyles({
    buttons: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

function NodeMap({ setStep, defaults, onUpdate, name, next }) {
    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep(next);
    }, [setStep, next]);
    const [root, setRoot] = useState(null);
    const editor = useMemo(() => {
        if (!root) return null;
        return new Rete.NodeEditor('dcdc@0.1.0', root);
    }, [root]);
    const onUpdateRef = useRef(onUpdate);
    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);
    useEffect(() => {
        if (!editor) return;
        (async () => {
            editor.use(ConnectionPlugin);
            editor.use(ReactRenderPlugin, { component: MyNode });
            editor.use(ContextMenuPlugin);
            components.forEach(component => editor.register(new component()));

            if (defaults) await editor.fromJSON(defaults);

            editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
                (onUpdateRef.current)(await editor.toJSON());
            });
        })();
    }, [editor, defaults]);
    const download = useCallback(async () => {
        if (!editor) return;
        const data = await editor.toJSON();
        const text = JSON.stringify(data);
        const blob = new Blob([text], { type: 'application/json' });
        saveAs(blob, `${name}.json`);
    }, [editor, name]);
    const upload = useCallback(async (files) => {
        if (!editor) return;
        const file = files[0];
        const text = await readAsText(file);
        const data = JSON.parse(text);
        await editor.fromJSON(data);
    }, [editor]);

    return <>
        <div ref={setRoot} style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
        }} />
        <Grid container spacing={2} classes={{ root: classes.buttons }} justify="flex-end">
            <Grid item>
                <ReactFileReader
                    fileTypes={[".json"]}
                    handleFiles={upload}>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        component="span"
                    >
                        上传
                    </Button>
                </ReactFileReader>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={download}
                >
                    下载
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={nextStep}
                >
                    下一步
                </Button>
            </Grid>
        </Grid>
    </>
}

export default NodeMap;
