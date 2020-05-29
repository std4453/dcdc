import React from 'react';
import NodeMap from '../retex/NodeMap';

function InitialValues({ initial, setInitial, setStep }) {
    return (
        <NodeMap setStep={setStep} defaults={initial} onUpdate={setInitial} name="initial" next="GenerationRules"/>
    );
}

function GenerationRules({ generation, setGeneration, setStep }) {
    return (
        <NodeMap setStep={setStep} defaults={generation} onUpdate={setGeneration} name="generation" next="Generation"/>
    );
}

export { InitialValues, GenerationRules };
