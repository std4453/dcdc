import React, { useCallback } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import NodeMap from './retex/NodeMap';

const useStyles = makeStyles({
    button: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

function InitialValues({ setStep }) {
    const classes = useStyles();
    const next = useCallback(() => {
        setStep('GenerationRules');
    }, [setStep]);
    return <>
        <NodeMap saveKey="initial" />
        <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={next}
            classes={{ root: classes.button }}
        >
            下一步
        </Button>
    </>;
}

function GenerationRules({ setStep }) {
    const classes = useStyles();
    const next = useCallback(() => {
        setStep('Generation');
    }, [setStep]);
    return <>
        <NodeMap saveKey="generation" />
        <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={next}
            classes={{ root: classes.button }}
        >
            下一步
        </Button>
    </>;
}

export { InitialValues, GenerationRules };
