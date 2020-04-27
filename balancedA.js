import { choose, uniform, interp, divide } from './utils';

export default ({
    gui, invalidate, width, height,
    inflated: { drawText: { fn: drawText }, split: { fn: split } },
}) => {
    const options = {
        meanDist: 0.7,
        variance: 0.1,
        lockDir: 'none',
        lockParts: 'none',
    };

    const folder = gui.addFolder('balancedA');
    folder.add(options, 'meanDist', 0, 2, 0.01).onChange(invalidate);
    folder.add(options, 'variance', -1, 1, 0.01).onChange(invalidate);
    folder.add(options, 'lockDir', ['none', 'horizontal', 'vertical']).onChange(invalidate);
    folder.add(options, 'lockParts', ['none', '1', '2', '3']).onChange(invalidate);
    folder.open();

    const fn = (text) => {
        const partsRnd = choose({ value: 1, weight: 0.7 }, { value: 2, weight: 0.3 });
        const parts = options.lockParts === 'none' ? partsRnd : parseInt(options.lockParts);
        const dirRnd = choose('vertical', 'horizontal');
        const dir = options.lockDir !== 'none' ? options.lockDir : dirRnd;
        const dist = uniform(options.meanDist - options.variance, options.meanDist + options.variance);
        split(text, parts).forEach((part, i) => {
            const { x, y } = interp(width, height, 0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
            drawText(part, x, y, { dir, align: 'middle' });
        });
    }

    return {
        folder, fn, options,
    };
}