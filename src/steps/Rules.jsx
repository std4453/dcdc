import React from 'react';
import NodeMap from '../retex/NodeMap';

function InitialValues({ setStep }) {
    return (
        <NodeMap setStep={setStep} saveKey="initial" next="GenerationRules"/>
    );
}

function GenerationRules({ setStep }) {
    return (
        <NodeMap setStep={setStep} saveKey="generation" next="Generation"/>
    );
}

export { InitialValues, GenerationRules };
