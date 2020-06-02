import React from 'react';
import NodeMap from '../retex/NodeMap';

function InitialValues({ initial, setInitial, setStep, next, prev }) {
    return (
        <NodeMap setStep={setStep} defaults={initial} onUpdate={setInitial} name="initial" next={next} prev={prev}/>
    );
}

function GenerationRules({ generation, setGeneration, setStep, next, prev }) {
    return (
        <NodeMap setStep={setStep} defaults={generation} onUpdate={setGeneration} name="generation" next={next} prev={prev}/>
    );
}

export { InitialValues, GenerationRules };
