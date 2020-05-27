import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
});

function Generation({ id, setData }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>

        </div>
    );
}

export default Generation;
