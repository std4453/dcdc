import { BeanComponent } from '../retex/components';
import * as _ from 'lodash';

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

    * worker({ key }, __, { inputs }) {
        const values = _.get(inputs, key);
        if (values instanceof Array) {
            for (const value of values) {
                yield {
                    val: value,
                };
            }
        } else {
            yield {
                val: values,
            };
        }
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

    * worker({ key }, __, { inputs }) {
        const values = _.get(inputs, key);
        if (values instanceof Array) {
            for (const value of values) {
                yield {
                    val: value,
                };
            }
        } else {
            yield {
                val: values,
            };
        }
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

    * worker({ val, key }, __, { outputs }) {
        if (!_.has(outputs, key)) _.set(outputs, key, []);
        _.get(outputs, key).push(val);
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

    * worker({ val, key }, __, { outputs }) {
        if (!_.has(outputs, key)) _.set(outputs, key, []);
        _.get(outputs, key).push(val);
        yield;
    }
}

export default [
    NumberInputComponent,
    StringInputComponent,
    NumberOutputComponent,
    StringOutputComponent,
];
