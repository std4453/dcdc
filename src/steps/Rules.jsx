import React from 'react';
import NodeMap from '../retex/NodeMap';

function InitialValues({ initial, setInitial, setStep, next }) {
    return (
        <NodeMap setStep={setStep} defaults={initial} onUpdate={setInitial} name="initial" next={next}/>
    );
}

function GenerationRules({ generation, setGeneration, setStep, next }) {
    return (
        <NodeMap setStep={setStep} defaults={generation} onUpdate={setGeneration} name="generation" next={next}/>
    );
}

export { InitialValues, GenerationRules };
