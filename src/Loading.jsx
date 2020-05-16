import React, { useEffect } from 'react';
import { makeStyles, LinearProgress, Grid } from '@material-ui/core';
import logo from './assets/logo-colored.svg';

const useStyles = makeStyles({
    grid: {
        height: '100%',
    },
    progress: {
        width: 600,
    },
});

const delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

function Loading({ id, setStep }) {
    const classes = useStyles();
    useEffect(async () => {
        // TODO: query backend
        await delay(5000);
        setStep('Moodboard');
    }, [setStep]);
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
    )
}

export default Loading;
