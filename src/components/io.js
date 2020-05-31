import { BeanComponent } from './BeanComponent';
import * as _ from 'lodash';

class InputComponent extends BeanComponent {
    constructor() {
        super(
            'Input',
            {
                key: { type: 'string' },
                type: { defaultVal: 'number', type: 'string', controlType: 'select', options: ['number', 'string'] },
            },
            {
                val: { type: 'any', controlType: 'string', },
            },
        );
    }

    convert(value, type) {
        if (type === 'number' && typeof value === 'string') return parseFloat(value);
        if (type === 'string' && typeof value === 'number') return `${value}`;
        return value;
    }

    * worker({ key, type }, __, { inputs }) {
        const values = _.get(inputs, key);
        if (values instanceof Array) {
            for (const value of values) {
                yield {
                    val: this.convert(value, type),
                };
            }
        } else {
            yield {
                val: this.convert(values, type),
            };
        }
    }
}

class OutputComponent extends BeanComponent {
    constructor() {
        super(
            'Output',
            {
                key: { type: 'string' },
                val: { type: 'any', controlType: 'string' },
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
    InputComponent,
    OutputComponent,
];
