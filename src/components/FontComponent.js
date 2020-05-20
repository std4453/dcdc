/* eslint-disable default-case */
import { BeanComponent } from '../retex/components';

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
                text: { defaultVal: '被害妄想携帯女子' },
                x0: { defaultVal: 960, min: -1000, max: 3000 },
                y0: { defaultVal: 540, min: -1000, max: 3000 },
                size: { defaultVal: 90, min: 10, max: 400 },
                dir: { defaultVal: 'horizontal', type: 'string', controlType: 'select', options: ['horizontal', 'vertical'] },
                align: { defaultVal: 'begin', type: 'string', controlType: 'select', options: ['begin', 'middle', 'end'] },
                spacing: { defaultVal: 0, min: -2, max: 2 },
                ignoreWhitespaces: { defaultVal: true },
                alignBaseline: { defaultVal: true },
            },
            {
                i: { type: 'number' },
                ch: { type: 'string' },
                x0: { type: 'number' },
                y0: { type: 'number' },
                size: { type: 'number' },
            },
        );
    }

    async * worker({
        text, x0, y0,
        size, dir, align,
        spacing, ignoreWhitespaces,
        alignBaseline,
    }) {
        if (ignoreWhitespaces) text = text.split(/\s+/).join('');
        let x = x0, y = y0;
        const sizes = new Array(text.length).fill(size);
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
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i];
            const bx = x;
            const by = alignBaseline && dir === 'horizontal' ? y - (sizes[i] - size) / 2 : y;
            yield {
                i,
                ch,
                x0: bx,
                y0: by,
                size: sizes[i],
            };
            switch (dir) {
                case 'horizontal':
                    x += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
                case 'vertical':
                    y += (sizes[i] + sizes[i + 1]) * (1 + spacing) / 2;
                    break;
            }
        }
        this.closed = ['cc'];
    }
}

export default FontComponent;
