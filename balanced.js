import { choose, uniform, interp, divide } from './utils';
import drawText from './text';
import split from './split';

export default ({ gui, ctx, invalidate, width, height }) => {
    const options = {
        minDist: 0.6,
        maxDist: 0.8,
    };

    const folder = gui.addFolder('balanced');
    folder.add(options, 'minDist', 0, 1.5, 0.01).onChange(invalidate);
    folder.add(options, 'maxDist', 0, 1.5, 0.01).onChange(invalidate);
    folder.open();

    const render = (text, { splitOptions, fontOptions }) => {
        const parts = text.length > 12 ? 2 : choose({ value: 1, weight: 0.7 }, { value: 2, weight: 0.3 });
        const dir = choose('vertical', 'horizontal');
        const dist = uniform(options.minDist, options.maxDist);
        split(text, parts, splitOptions).forEach((part, i) => {
            const { x, y } = interp(width, height, 0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
            drawText(ctx, part, x, y, { dir, align: 'middle', ...fontOptions });
        });
    }

    return {
        folder, render, options,
    };
}