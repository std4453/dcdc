import React, { useState } from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import SongSelection from './SongSelection';
import Loading from './Loading';
import Moodboard from './Moodboard';
import Segmentation from './Segmentation';
import { InitialValues, GenerationRules } from './Rules';
import Generation from './Generation';

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
        SongSelection, Loading, Moodboard, Segmentation,
        InitialValues, GenerationRules, Generation,
    }[step];

    const [id, setId] = useState('');
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [moodboard, setMoodboard] = useState({});

    const params = {
        step, setStep,
        id, setId,
        error, setError,
        data, setData,
        moodboard, setMoodboard,
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
