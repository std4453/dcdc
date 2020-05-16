import React, { useState, useMemo } from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import SongSelection from './SongSelection';

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
});

function App() {
    const classes = useStyles();
    const [step, setStep] = useState('SongSelection');
    const Component = {
        SongSelection,
    }[step];

    const [id, setId] = useState('');
    const [error, setError] = useState(null);

    const params = {
        step, setStep,
        id, setId,
        error, setError,
    };
    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
                <Component {...params}/>
            </div>
        </MuiThemeProvider>
    )
}

export default App;
