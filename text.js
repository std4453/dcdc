import { uniform } from './utils';

const textWidth = (text, sizes, spacing) => {
    // VERY SIMPLE
    // return size * text.length + spacing * size * (text.length - 1);
    let width = 0;
    for (let i = 0; i < text.length; ++i) {
        width += sizes[i] * (1 + spacing);
    }
    width -= sizes[0] * spacing / 2;
    width -= sizes[text.length - 1] * spacing / 2;
    return width;
}

export default ({ invalidate, gui, ctx }) => {
    const options = {
        size: 90,
        color: '#000000',
        fontFamily: 'Hiragino Mincho Pro',
        fontWeight: 900,
        spacing: 0,
        ignoreWhitespaces: true,
        sizeRnd: 0,
        rotateRnd: 0,
    };

    const folder = gui.addFolder('font');
    folder.add(options, 'size', 20, 200).onChange(invalidate);
    folder.addColor(options, 'color').onChange(invalidate);
    folder.add(options, 'fontFamily').onChange(invalidate);
    folder.add(options, 'fontWeight', 100, 900, 100).onChange(invalidate);
    folder.add(options, 'spacing', -0.5, 0.5, 0.01).onChange(invalidate);
    folder.add(options, 'ignoreWhitespaces').onChange(invalidate);
    folder.add(options, 'sizeRnd', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'rotateRnd', 0, 1, 0.01).onChange(invalidate);
    folder.open();

    const fn = (text, x0, y0, additionalOptions) => {
        const {
            size, dir = 'horizontal', align = 'begin', color, rotate = 0,
            fontFamily, fontWeight, spacing, ignoreWhitespaces, sizeRnd = 0,
            alignBaseline = true,
        } = {
            ...options,
            ...additionalOptions,
        };
        if (ignoreWhitespaces) text = text.split(/\s+/).join('');
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(rotate);
        let x = 0, y = 0;
        const sizes = new Array(text.length).fill(0).map(() => size * uniform(1 - sizeRnd / 2, 1 + sizeRnd / 2));
        const width = textWidth(text, sizes, spacing);
        if (align === 'middle') {
            switch (dir) {
                case 'horizontal':
                    x -= width / 2;
                    break;
                case 'vertical':
                    y -= width / 2;
                    break;
            }
        }
        if (align === 'end') {
            switch (dir) {
                case 'horizontal':
                    x -= width;
                    break;
                case 'vertical':
                    y -= width;
                    break;
            }
        }
        switch (dir) {
            case 'horizontal':
                x += sizes[0] / 2;
                break;
            case 'vertical':
                y += sizes[0] / 2;
                break;
        }
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        text.split('').forEach((ch, i) => {
            ctx.font = `${fontWeight} ${sizes[i]}px \'${fontFamily}\'`;
            const bx = x;
            const by = alignBaseline && dir === 'horizontal' ? y - (sizes[i] - size) / 2 : y;
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(uniform(-Math.PI / 2 * options.rotateRnd, Math.PI / 2 * options.rotateRnd));
            ctx.fillText(ch, 0, 0);
            ctx.restore();
            switch (dir) {
                case 'horizontal':
                    x += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
                case 'vertical':
                    y += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
            }
        });
        ctx.restore();
    };

    return { options, folder, fn };
};
