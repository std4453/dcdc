import { BeanComponent } from '../retex/components';
import { uniform } from '../utils';

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

class FontComponent extends BeanComponent {
    constructor() {
        super(
            'Font',
            {
                ctx: { type: 'canvas', required: true },
                text: { defaultVal: '被害妄想携帯女子' },
                x0: { defaultVal: 960 },
                y0: { defaultVal: 540 },
                size: { defaultVal: 90 },
                dir: { defaultVal: 'horizontal' },
                align: { defaultVal: 'begin' },
                color: { defaultVal: '#000000' },
                fontFamily: { defaultVal: 'Hiragino Mincho Pro' },
                fontWeight: { defaultVal: 900 },
                spacing: { defaultVal: 0 },
                ignoreWhitespaces: { defaultVal: true },
                alignBaseline: { defaultVal: true },
                sizeVar: { defaultVal: 0 },
                meanRotate: { defaultVal: 0 },
                rotateVar: { defaultVal: 0 },
            },
            {}
        );
    }

    exec({
        ctx, text, x0, y0,
        size, dir, align, color, rotate,
        fontFamily, fontWeight, spacing, ignoreWhitespaces, sizeVar,
        alignBaseline, meanRotate, rotateVar,
    }) {
        if (ignoreWhitespaces) text = text.split(/\s+/).join('');
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(rotate);
        let x = 0, y = 0;
        const sizes = new Array(text.length).fill(0).map(() => size * uniform(1 - sizeVar / 2, 1 + sizeVar / 2));
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
            ctx.rotate(uniform(
                Math.PI / 2 * (meanRotate - rotateVar),
                Math.PI / 2 * (meanRotate + rotateVar)));
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
    }
}

export default FontComponent;
