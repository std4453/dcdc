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
        const parsed = this.parser.parse(expr);
        yield {
            z: parsed.evaluate({ x, y }),
        };
    }
}

class StringComponent extends BeanComponent {
    constructor() {
        super(
            'String',
            {
                val: { defaultVal: '', type: 'string' },
            },
            {
                val: { type: 'string' },
            },
        );
    }

    * worker({ val }) {
        yield { val };
    }
}

class NumberComponent extends BeanComponent {
    constructor() {
        super(
            'Number',
            {
                val: { defaultVal: 0.0, min: -Infinity, max: Infinity },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    * worker({ val }) {
        yield { val };
    }
}

class DimensionComponent extends BeanComponent {
    constructor() {
        super(
            'Dimension',
            {
                x0: { defaultVal: 0.25, min: 0, max: 1 },
                y0: { defaultVal: 0.25, min: 0, max: 1 },
                x1: { defaultVal: 0.75, min: 0, max: 1 },
                y1: { defaultVal: 0.75, min: 0, max: 1 },
            },
            {
                val: { type: 'dimension' },
            },
        );
    }

    * worker({ x0, y0, x1, y1 }) {
        yield {
            val: { x0, y0, x1, y1 },
        };
    }
}

export default [
    ArithmeticComponent,
    Arithmetic2Component,
    NumberComponent,
    StringComponent,
    DimensionComponent,
];
