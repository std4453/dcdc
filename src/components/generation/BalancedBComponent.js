import { BeanComponent } from '../../retex/components';
import pickRandom from 'pick-random';

class BalancedBComponent extends BeanComponent {
    constructor() {
        super(
            'BalancedB',
            {
                text: { type: 'string' },
                rows: { defaultVal: 3, min: 2, max: 4, step: 1 },
                cols: { defaultVal: 4, min: 2, max: 4, step: 1 },
                dist: { defaultVal: 2, min: 0.5, max: 10 },
                width: { type: 'number' },
                height: { type: 'number' },
                size: { type: 'number' },
            },
            {
                text: { type: 'string' },
                x0: { type: 'number' },
                y0: { type: 'number' },
                align: { type: 'string' },
            },
        );
    }

    async * worker ({ text, rows, cols, dist, width, height, size }) {
        const indices = pickRandom(
            new Array(cols).fill(0).map(
                (_, u) => new Array(rows).fill(0).map((_, v) => ({ u, v }))
            ).reduce((a, b) => [...a, ...b], []),
            { count: Math.min(rows * cols, text.length) },
        ).sort(({ u: u1, v: v1 }, { u: u2, v: v2 }) => v2 === v1 ? (u1 - u2) : (v1 - v2));

        for (let i = 0; i < indices.length; ++i) {
            const { u, v } = indices[i];
            const x = width / 2 + (u - (cols - 1) / 2) * dist * size;
            const y = height / 2 + (v - (rows - 1) / 2) * dist * size;
            yield {
                text: text[i],
                x0: x,
                y0: y,
                align: 'middle',
            };
        }
    }
}

export default BalancedBComponent;
