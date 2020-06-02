import React, { useState, useMemo, useCallback, useRef } from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

import './index.css';
import { steps, initialStep, nextSteps } from './steps';
import defaultInitial from './assets/initial.json';
import defaultGeneration from './assets/generation.json';

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

const useAutoSave = (initial, saveKey, timeout = 3000) => {
    const actualInitial = useMemo(() => {
        if (localStorage[saveKey]) {
            return JSON.parse(localStorage[saveKey]);
        } else return initial;
    }, [initial, saveKey]);
    const valueRef = useRef(actualInitial);
    const setValue = useCallback((value) => {
        valueRef.current = value;
        setTimeout(() => {
            if (value !== valueRef.current) return;
            localStorage[saveKey] = JSON.stringify(value);
            console.log('Data saved!');
        }, timeout);
    }, [saveKey, timeout]);
    return [actualInitial, setValue, valueRef];
}

function App() {
    const classes = useStyles();
    const [step, setStep] = useState(initialStep);
    const Component = steps[step];

    const [id, setId] = useState('');
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [moodboard, setMoodboard] = useState({});
    const [initial, setInitial, initialRef] = useAutoSave(defaultInitial, 'initial');
    const [generation, setGeneration, generationRef] = useAutoSave(defaultGeneration, 'generation');

    const params = {
        next: nextSteps[step],
        step, setStep,
        id, setId,
        error, setError,
        data, setData,
        moodboard, setMoodboard,
        initial, setInitial, initialRef, generation, setGeneration, generationRef,
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
