import React, { useEffect, useMemo } from 'react';
import { makeStyles, LinearProgress, Grid } from '@material-ui/core';
import { Lrc } from 'lrc-kit';
import logo from '../assets/logo-colored.svg';

function FetchData({ id, setData, ...params }) {
    const action = useMemo(async () => {
        const resp = await fetch(`https://dcdcapi.herokuapp.com/song/${id}`);
        const data = await resp.json();
        setData(data);
    }, [id, setData]);
    return (
        <Loading {...params} action={action} />
    );
}

function FetchFont({
    data: { lrc },
    moodboard: { fontName: family, fontWeight: weight },
    ...params
}) {
    const action = useMemo(async () => {
        const { lyrics } = Lrc.parse(lrc);
        const chs = new Set();
        for (const { content } of lyrics) {
            for (const ch of content) {
                chs.add(ch);
            }
        }
        console.log(Array.from(chs).join(''));        const resp = await fetch('https://dcdcapi.herokuapp.com/font', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                font: family,
                weight: weight,
                glyphs: Array.from(chs).join(''),
            }),
        });
        const blob = await resp.arrayBuffer();
        const font = new FontFace(family, blob, { weight });
        await font.load();
        document.fonts.add(font);
    }, []);
    return (
        <Loading {...params} action={action} />
    );
}

const useStyles = makeStyles({
    grid: {
        height: '100%',
    },
    progress: {
        width: 600,
    },
});

function Loading({ setStep, next, action }) {
    const classes = useStyles();
    useEffect(() => {
        (async () => {
            try {
                await action;
                setStep(next);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [setStep, action, next]);

    return (
        <Grid
            container
            justify="center"
            spacing={4}
            className={classes.grid}
            alignItems="center"
            direction="column"
        >
            <Grid item>
                <img src={logo} alt="" height="51" />
            </Grid>
            <Grid item classes={{ root: classes.progress }}>
                <LinearProgress />
            </Grid>
        </Grid>
    );
}

export { FetchData, FetchFont };
