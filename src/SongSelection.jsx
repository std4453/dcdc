import React from 'react';
import { makeStyles, Button, TextField, Grid } from '@material-ui/core';
import logo from './assets/logo-colored.svg';

const useStyles = makeStyles({
    grid: {
        height: '100%',
    },
    input: {
        width: 500,
    },
});

function SongSelection() {
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
            <Grid item>
                <img src={logo} alt="" height="51" />
            </Grid>
            <Grid item container spacing={1} justify="center">
                <Grid item>
                    <TextField
                        label="网易云音乐ID"
                        variant="outlined"
                        size="small"
                        classes={{ root: classes.input }}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" disableElevation>
                        开始创建
                        </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SongSelection;
