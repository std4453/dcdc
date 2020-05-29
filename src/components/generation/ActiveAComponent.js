import { BeanComponent } from '../BeanComponent';
import { interp, opposite } from '../utils';

class ActiveAComponent extends BeanComponent {
    constructor() {
        super(
            'ActiveA',
            {
                width: { type: 'number' },
                height: { type: 'number' },
                i: { type: 'number' },
                angle: { defaultVal: -0.2, min: -1, max: 1 },
                dir: { defaultVal: 'horizontal', type: 'string', controlType: 'select', options: ['horizontal', 'vertical'] },
                x0: { defaultVal: 0.35, min: 0.25, max: 0.5 },
                y0: { defaultVal: 0.25, min: 0.15, max: 0.4 },
            },
            {
                x0: { type: 'number' },
                y0: { type: 'number' },
                dir: { type: 'string' },
                rotate: { type: 'number' },
                align: { type: 'string' },
            },
        );
    }

    async * worker({ width, height, i, angle, dir, x0: a, y0: b }) {
        const rx = opposite(a, i === 1);
        const ry = opposite(b, i === 1);
        const { x, y } = interp(width, height, rx, ry, dir);
        yield {
            x0: x,
            y0: y,
            dir,
            rotate: angle * Math.PI / 2,
            align: 'middle',
        };
    }
}

export default ActiveAComponent;
