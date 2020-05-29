import { BeanComponent } from '../BeanComponent';
import { interp, opposite, scatter, translate } from '../utils';

class NeutralComponent extends BeanComponent {
    constructor() {
        super(
            'Neutral',
            {
                width: { type: 'number' },
                height: { type: 'number' },
                i: { type: 'number' },
                size: { type: 'number' },
                lineSpacing: { defaultVal: 1.5, min: 0.5, max: 5, },
                dir: { defaultVal: 'horizontal', type: 'string', controlType: 'select', options: ['horizontal', 'vertical'] },
                align: { defaultVal: 'begin', type: 'string', controlType: 'select', options: ['begin', 'end'] },
                position: { defaultVal: 'left', type: 'string', controlType: 'select', options: ['left', 'right'] },
                x0: { defaultVal: 0.15, min: 0.1, max: 0.25 },
                y0: { defaultVal: 0.3, min: 0.1, max: 0.5 },
            },
            {
                x0: { type: 'number' },
                y0: { type: 'number' },
                dir: { type: 'string' },
                align: { type: 'string' },
            },
        );
    }

    async * worker({ width, height, size, lineSpacing, i, dir, align, position, x0, y0 }) {
        const x = opposite(x0, align === 'end');
        const y = opposite(y0, position === 'right');
        let point = interp(width, height, x, y, dir);
        const delta = scatter(size * lineSpacing * (position === 'left' ? 1 : -1), dir, true);
        for (; i > 0; --i) point = translate(point, delta);
        yield {
            x0: point.x,
            y0: point.y,
            dir,
            align,
        };
    }
}

export default NeutralComponent;
