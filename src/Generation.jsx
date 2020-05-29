import { makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import DatGui, { DatFolder, DatString } from 'react-dat-gui';
import exec from './retex/exec';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    side: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

const config = [
    {
        name: 'folder title',
        type: 'folder',
        children: [
            { name: 'text', type: 'string', path: 'text' },
        ],
    },
];

function Generation({
    moodboard,
    data,
}) {
    const classes = useStyles();
    const [params, setParams] = useState(null);
    useEffect(() => {
        (async () => {
            const ctx = {
                inputs: {
                    moodboard,
                    data,
                },
                outputs: {},
            };
            await exec('initial', ctx);
            setParams(ctx.outputs);
        })();
    }, [data, moodboard]);
    const [canvas, setCanvas] = useState(null);
    useEffect(() => {
        if (!params || !canvas) return;
        (async () => {
            const ctx = {
                canvas,
                inputs: { ...params },
                outputs: {},
            };
            await exec('generation', ctx);
        })();
    }, [canvas, params]);
    const convert = useMemo(() => {
        const convert = ({ name, path, type, children }) => {
            switch (type) {
                case 'folder': return (
                    <DatFolder title={name}>
                        {children.map(convert)}
                    </DatFolder>
                );
                case 'string': return (
                    <DatString path={path} label={name} />
                );
                default: return null;
            }
        };
        return convert;
    }, []);
    return (
        <div className={classes.root}>
            <canvas className={classes.canvas} ref={setCanvas}/>
            <div className={classes.side}>
                <DatGui
                    data={params}
                    onUpdate={(newData) => {
                        newData = { ...data, ...newData };
                        setParams(newData);
                    }}
                    style={{
                        position: 'relative',
                        backgroundColor: '#1A1A1A',
                    }}
                >
                    {config.map(convert)}
                </DatGui>
            </div>
        </div>
    );
}

export default Generation;
