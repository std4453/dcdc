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

const drawText = (ctx, text, x0, y0, {
    size, dir = 'horizontal', align = 'begin', color, rotate = 0,
    fontFamily, fontWeight, spacing, ignoreWhitespaces, sizeRandomness = 0,
    alignBaseline = true,
} = {}) => {
    if (ignoreWhitespaces) text = text.split(/\s+/).join('');
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(rotate);
    let x = 0, y = 0;
    const sizes = new Array(text.length).fill(0).map(() => size * uniform(1 - sizeRandomness / 2, 1 + sizeRandomness / 2));
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
    ctx.textBaseline = { horizontal: 'middle', vertical: 'top' }[dir];
    ctx.textAlign = { horizontal: 'start', vertical: 'center' }[dir];
    ctx.fillStyle = color;
    text.split('').forEach((ch, i) => {
        ctx.font = `${fontWeight} ${sizes[i]}px \'${fontFamily}\'`;
        ctx.fillText(ch, x, alignBaseline && dir === 'horizontal'
            ? y - (sizes[i] - size) / 2 : y);
        switch (dir) {
            case 'horizontal':
                x += sizes[i] * (1 + spacing / 2) + sizes[i + 1] * spacing / 2;
                break;
            case 'vertical':
                y += sizes[i] * (1 + spacing / 2) + sizes[i + 1] * spacing / 2;
                break;
        }
    });
    ctx.restore();
}

export default drawText;
