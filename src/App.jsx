import React from 'react';
import { MuiThemeProvider, makeStyles, Button, TextField, Grid } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import logo from './assets/logo-colored.svg';

import './index.css';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#BB86FC' },
        secondary: { main: '#BB86FC' },
        type: 'dark',
    },
});

const useStyles = makeStyles({
    root: {
        backgroundColor: '#121212',
        overflow: 'hidden',
        height: '100vh',
    },
    grid: {
        height: '100%',
    },
    input: {
        width: 500,
    },
});

function App({ }) {
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
                <Grid
                    container
                    justify="center"
                    spacing={4}
                    className={classes.grid}
                    alignItems="center"
                    direction="column"
                >
                    <Grid item>
                        <img src={logo} alt="" height="51"/>
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
            </div>
        </MuiThemeProvider>
    )
}

export default App;
