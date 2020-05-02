import { BeanComponent } from '../retex/components';
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

    exec({ expr, x }) {
        const parsed = this.parser.parse(expr);
        return {
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

    exec({ expr, x, y }) {
        const parsed = this.parser.parse(expr);
        return {
            z: parsed.evaluate({ x, y }),
        };
    }
}

export { ArithmeticComponent, Arithmetic2Component };
