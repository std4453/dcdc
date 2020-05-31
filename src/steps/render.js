import * as _ from 'lodash';
import pickRandom from 'pick-random';
import random from 'random';
import seedrandom from 'seedrandom';

import { interp, divide } from '../components/utils';

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

function* font({
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
}

function char({
    ctx, ch, x0, y0,
    size, rotate, color,
    fontFamily, fontWeight,
}) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${size}px '${fontFamily}'`;
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(rotate * Math.PI);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
}

function* split({ text, parts, randomness }) {
    const step = text.length / parts;
    const deltas = [0, ...new Array(parts - 1).fill(0).map(() => (Math.random() - 0.5) * 2 * randomness), 0];
    for (let i = 0; i < parts; ++i) {
        const begin = Math.round(i * step + deltas[i]);
        const end = Math.round((i + 1) * step + deltas[i + 1]);
        yield {
            parts,
            i,
            text: text.substring(begin, end),
        };
    }
}

function* balancedA({ width, height, i, parts, dist, dir }) {
    const { x, y } = interp(width, height, 0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
    yield {
        x0: x,
        y0: y,
        dir,
        align: 'middle',
    };
}

random.patch();

const render = ({ width, height, seed, ctx, params, lyric }) => {
    const rng = seedrandom(`${seed}`);
    random.use(rng);

    const mode = pickRandom(_
        .keys(params.modes)
        .filter(key => params.modes[key].enabled)
    )[0];
    switch (mode) {
        case 'a': {
            const parts = random.int(1, params.splitMax);
            const dir = pickRandom(['horizontal', 'vertical'])[0];
            const it = split({
                text: lyric,
                parts,
                randomness: 0,
            });
            for (const { i, text } of it) {
                const it = balancedA({
                    width, height, i, parts,
                    dist: random.float(params.modes.a.minDist, params.modes.a.maxDist),
                    dir,
                });
                for (const { x0, y0, dir, align } of it) {
                    const it = font({
                        text, x0, y0,
                        size: params.size,
                        dir, align,
                        spacing: params.letterSpacing,
                        ignoreWhitespaces: true,
                        alignBaseline: false,
                    });
                    for (const { ch, x0, y0, size } of it) {
                        char({
                            ctx, ch, x0, y0,
                            size,
                            rotate: 0,
                            color: params.textColor,
                            fontFamily: params.fontFamily,
                            fontWeight: params.fontWeight,
                        });
                    }
                }
            }
        }
    }
}

export default render;