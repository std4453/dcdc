import { choose, uniform, interp, opposite, scatter, translate } from './utils';

export default ({
    gui, invalidate, width, height,
    inflated: { drawText: { fn: drawText, options: fontOptions }, split: { fn: split } },
}) => {
    const options = {
        lineSpacing: 1.5,
    };

    const folder = gui.addFolder('neutral');
    folder.add(options, 'lineSpacing', 0.5, 5, 0.01).onChange(invalidate);
    folder.open();

    const fn = (text) => {
        const parts = 2;
        const dir = choose('vertical', 'horizontal');
        const align = choose('begin', 'end');
        const position = choose('left', 'right');
        const [x0, x1] = choose(
            { value: [0.35, 0.43], weight: 3 },
            { value: [0.25, 0.35], weight: 2 },
            { value: [0.1, 0.25], weight: 1 });
        const x = opposite(uniform(0.1, 0.25), align === 'end');
        const y = opposite(uniform(x0, x1), position === 'right');
        let point = interp(width, height, x, y, dir);
        const delta = scatter(fontOptions.size * options.lineSpacing * (position === 'left' ? 1 : -1), dir, true);
        split(text, parts).forEach((part) => {
            const { x, y } = point;
            drawText(part, x, y, { dir, align });
            point = translate(point, delta);
        });
    };

    return {
        options, folder, fn,
    };
};
