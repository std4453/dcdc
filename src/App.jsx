import React, { useState } from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import SongSelection from './SongSelection';
import Loading from './Loading';

import './index.css';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#BB86FC' },
        secondary: { main: '#A0A0A0' },
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
        SongSelection, Loading,
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
