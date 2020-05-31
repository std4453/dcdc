import { BeanComponent } from './BeanComponent';
import { Parser } from 'expr-eval';

class ArithmeticComponent extends BeanComponent {
    constructor() {
        super(
            'Eval',
            {
                expr: { defaultVal: 'x' },
                x: { defaultVal: '0', type: 'number' },
            },
            {
                y: { type: 'number' },
            },
        );
        this.parser = new Parser();
    }

    * worker({ expr, x }) {
        const parsed = this.parser.parse(expr);
        yield {
            y: parsed.evaluate({ x }),
        };
    }
}

class Arithmetic2Component extends BeanComponent {
    constructor() {
        super(
            'Eval2',
            {
                expr: { defaultVal: 'x + y' },
                x: { defaultVal: '0', type: 'number' },
                y: { defaultVal: '0', type: 'number' },
            },
            {
                z: { type: 'number' },
            },
        );
        this.parser = new Parser();
    }

    * worker({ expr, x, y }) {
        console.log(expr, x, y);
        const parsed = this.parser.parse(expr);
        yield {
            z: parsed.evaluate({ x, y }),
        };
    }
}

class ConstComponent extends BeanComponent {
    constructor() {
        super(
            'Const',
            {
                val: { type: 'any', controlType: 'string' },
                type: { defaultVal: 'number', type: 'string', controlType: 'select', options: ['number', 'string'] },
            },
            {
                val: { type: 'string' },
            },
        );
    }

    * worker({ val, type }) {
        if (type === 'number') val = parseFloat(val);
        yield { val };
    }
}

export default [
    ArithmeticComponent,
    Arithmetic2Component,
    ConstComponent,
];
