import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles({
});

function Loading({ id, setStep }) {
    const classes = useStyles();
    return (
        <Grid
            container
            justify="center"
            spacing={4}
            className={classes.grid}
            alignItems="center"
            direction="column"
        >
            {/* TODO: fill content */}
        </Grid>
    )
}

export default Loading;
