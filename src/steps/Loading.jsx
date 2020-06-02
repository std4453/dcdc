import React, { useEffect } from 'react';
import { makeStyles, LinearProgress, Grid } from '@material-ui/core';
import logo from '../assets/logo-colored.svg';

const useStyles = makeStyles({
    grid: {
        height: '100%',
    },
    progress: {
        width: 600,
    },
});

function Loading({ id, setStep, setData }) {
    const classes = useStyles();
    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`https://dcdcapi.herokuapp.com/song/${id}`);
                const data = await resp.json();
                setData(data);
                setStep('Moodboard');
            } catch (e) {
                console.log(e);
            }
        })();
    }, [setStep, setData, id]);
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
