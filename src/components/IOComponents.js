import { BeanComponent } from '../retex/components';

class NumberInputComponent extends BeanComponent {
    constructor() {
        super(
            'NumberInput',
            {
                key: { type: 'string' },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    * worker({ key }, _, { inputs }) {
        yield {
            val: inputs[key],
        };
    }
}

class StringInputComponent extends BeanComponent {
    constructor() {
        super(
            'StringInput',
            {
                key: { type: 'string' },
            },
            {
                val: { type: 'string' },
            },
        );
    }

    * worker({ key }, _, { inputs }) {
        yield {
            val: inputs[key],
        };
    }
}

class NumberOutputComponent extends BeanComponent {
    constructor() {
        super(
            'NumberOutput',
            {
                key: { type: 'string' },
                val: { type: 'number' },
            },
            {},
        );
    }

    * worker({ val, key }, _, { outputs }) {
        if (!(key in outputs)) outputs[key] = [];
        outputs[key].push(val);
        yield;
    }
}

class StringOutputComponent extends BeanComponent {
    constructor() {
        super(
            'StringOutput',
            {
                key: { type: 'string' },
                val: { type: 'string' },
            },
            {},
        );
    }

    * worker({ val, key }, _, { outputs }) {
        if (!(key in outputs)) outputs[key] = [];
        outputs[key].push(val);
        yield;
    }
}

export default [
    NumberInputComponent,
    StringInputComponent,
    NumberOutputComponent,
    StringOutputComponent,
];
