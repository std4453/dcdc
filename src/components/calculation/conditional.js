import { BeanComponent } from '../BeanComponent';

class ScatterComponent extends BeanComponent {
    constructor() {
        super(
            'Scatter',
            {
                cond: { type: 'number' },
                thres: { type: 'number' },
                val: { type: 'number' },
            },
            {
                lt: { type: 'number' },
                gt: { type: 'number' },
            },
        );
    }

    * worker({ cond, thres, val }) {
        if (cond <= thres) {
            yield { lt: val };
        } else {
            yield { gt: val };
        }
    }
}

class GatherComponent extends BeanComponent {
    constructor() {
        super(
            'Gather',
            {
                cond: { type: 'number' },
                thres: { type: 'number' },
                lt: { defaultVal: 0 },
                gt: { defaultVal: 0 },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    * worker({ cond, thres, lt, gt }) {
        if (cond <= thres) {
            yield { val: lt };
        } else {
            yield { val: gt };
        }
    }
}

class Gather10Component extends BeanComponent {
    constructor() {
        super(
            'Gather10',
            {
                ind: { defaultVal: 0, min: 0, max: 9 },
                n0: { defaultVal: 0 },
                n1: { defaultVal: 0 },
                n2: { defaultVal: 0 },
                n3: { defaultVal: 0 },
                n4: { defaultVal: 0 },
                n5: { defaultVal: 0 },
                n6: { defaultVal: 0 },
                n7: { defaultVal: 0 },
                n8: { defaultVal: 0 },
                n9: { defaultVal: 0 },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    * worker({ ind, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9 }) {
        const vals = [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9];
        yield { val: vals[ind] };
    }
}

export default [
    ScatterComponent,
    GatherComponent,
    Gather10Component,
];
