import { BeanComponent } from '../BeanComponent';
import { interp, divide } from '../../utils';

class BalancedAComponent extends BeanComponent {
    constructor() {
        super(
            'BalancedA',
            {
                width: { type: 'number' },
                height: { type: 'number' },
                i: { type: 'number' },
                parts: { type: 'number' },
                dist: { defaultVal: 0.7, min: 0, max: 1, },
                dir: { defaultVal: 'horizontal', type: 'string', controlType: 'select', options: ['horizontal', 'vertical'] },
            },
            {
                x0: { type: 'number' },
                y0: { type: 'number' },
                dir: { type: 'string' },
            },
        );
    }

    async * worker({ width, height, i, parts, dist, dir }) {
        const { x, y } = interp(width, height, 0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
        yield {
            x0: x,
            y0: y,
            dir,
            align: 'middle',
        };
    }
}

export default BalancedAComponent;
