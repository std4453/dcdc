import { choose, uniform, interp, opposite } from './utils';

export default ({
    gui, invalidate, width, height,
    inflated: { drawText: { fn: drawText }, split: { fn: split } },
}) => {
    const options = {
        minAngle: -0.2,
        maxAngle: 0,
    };

    const folder = gui.addFolder('activeA');
    folder.add(options, 'minAngle', -1, 1, 0.01).onChange(invalidate);
    folder.add(options, 'maxAngle', -1, 1, 0.01).onChange(invalidate);
    folder.open();

    const fn = (text) => {
        const parts = 2;
        const angle = Math.PI / 2 * uniform(options.minAngle, options.maxAngle);
        const dir = choose('horizontal', 'vertical');
        const [x0, x1] = choose(
            { value: [0.25, 0.35], weight: 3 },
            { value: [0.35, 0.45], weight: 2 },
            { value: [0.45, 0.50], weight: 0.5 },
        );
        const a = uniform(x0, x1);
        const [y0, y1] = choose(
            { value: [0.15, 0.25], weight: 3 },
            { value: [0.25, 0.4], weight: 2 },
        );
        const b = uniform(y0, y1);
        split(text, parts).forEach((part, i) => {
            const rx = opposite(a, i === 1);
            const ry = opposite(b, i === 1);
            const { x, y } = interp(width, height, rx, ry, dir);
            drawText(part, x, y, { dir, rotate: angle, align: 'middle' });
        })
    };

    return { options, folder, fn };
}
