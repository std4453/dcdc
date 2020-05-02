import React, { useState, useCallback } from 'react';
import Rete from 'rete';

function NumberControlInner({ id, displayName, defaultVal, emitter, putData }) {
    const [value, setValue] = useState(defaultVal);
    const onChange = useCallback(({ target: { value } }) => {
        setValue(value),
        putData(id, value);
        emitter.trigger("process");
    }, [id, emitter]);

    return (
        <input value={value} onChange={onChange} type="number" />
    );
}

class NumberControl extends Rete.Control {
    constructor(emitter, key, displayName, defaultVal) {
        super(key);
        this.render = 'react';
        this.component = NumberControlInner;
        this.props = { emitter, defaultVal, displayName, id: key, putData: this.putData.bind(this) };
    }
}

const controls = {
    number: NumberControl,
};

export default controls;
