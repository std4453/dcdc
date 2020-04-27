import { choose, uniform, interp, divide } from './utils';
import pickRandom from 'pick-random';

export default ({
    gui, invalidate, width, height,
    inflated: { drawText: { fn: drawText, options: fontOptions }, split: { fn: split } },
}) => {
    const options = {
        meanDist: 2.0,
        variance: 0.3,
        lockRows: 'none',
        lockCols: 'none',
    };

    const folder = gui.addFolder('balancedB');
    folder.add(options, 'meanDist', 0.5, 10, 0.01).onChange(invalidate);
    folder.add(options, 'variance', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'lockRows', ['none', '2', '3', '4']).onChange(invalidate);
    folder.add(options, 'lockCols', ['none', '2', '3', '4']).onChange(invalidate);
    folder.open();

    const fn = (text) => {
        const rowsRnd = choose(2, 3, 4);
        const rows = options.lockRows === 'none' ? rowsRnd : parseInt(options.lockRows);
        const colsRnd = choose(2, 3, 4);
        const cols = options.lockCols === 'none' ? colsRnd : parseInt(options.lockCols);
        const dist = uniform(1 - options.variance, 1 + options.variance) * options.meanDist * fontOptions.size;
        const indices = pickRandom(
            new Array(cols).fill(0).map(
                (_, u) => new Array(rows).fill(0).map((_, v) => ({ u, v }))
            ).reduce((a, b) => [...a, ...b], []),
            { count: Math.min(rows * cols, text.length) },
        ).sort(({ u: u1, v: v1 }, { u: u2, v: v2 }) => v2 === v1 ? (u1 - u2) : (v1 - v2));
        indices.forEach(({ u, v }, i) => {
            const x = width / 2 + (u - (cols - 1) / 2) * dist;
            const y = height / 2 + (v - (rows - 1) / 2) * dist;
            drawText(text[i], x, y, { align: 'middle' });
        });
    }

    return {
        folder, fn, options,
    };
}