import React, { useEffect, useMemo } from 'react';
import { makeStyles, LinearProgress, Grid } from '@material-ui/core';
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

function FetchFont({ data, ...params }) {
    const action = useMemo(async () => {
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
