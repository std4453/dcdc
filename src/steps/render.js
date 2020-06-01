import * as _ from 'lodash';
import pickRandom from 'pick-random';
import random from 'random';
import seedrandom from 'seedrandom';
import Color from 'color';

import { interp, divide, opposite, scatter, translate } from '../components/utils';

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

function* balancedB({ text, rows, cols, dist, width, height, size }) {
    const indices = pickRandom(
        new Array(cols).fill(0).map(
            (_, u) => new Array(rows).fill(0).map((_, v) => ({ u, v }))
        ).reduce((a, b) => [...a, ...b], []),
        { count: Math.min(rows * cols, text.length) },
    ).sort(({ u: u1, v: v1 }, { u: u2, v: v2 }) => v2 === v1 ? (u1 - u2) : (v1 - v2));

    for (let i = 0; i < indices.length; ++i) {
        const { u, v } = indices[i];
        const x = width / 2 + (u - (cols - 1) / 2) * dist * size;
        const y = height / 2 + (v - (rows - 1) / 2) * dist * size;
        yield {
            text: text[i],
            x0: x,
            y0: y,
            align: 'middle',
        };
    }
}

function* neutral({ width, height, size, lineSpacing, i, dir, align, position, x0, y0 }) {
    const x = opposite(x0, align === 'end');
    const y = opposite(y0, position === 'right');
    let point = interp(width, height, x, y, dir);
    const delta = scatter(size * lineSpacing * (position === 'left' ? 1 : -1), dir, true);
    for (; i > 0; --i) point = translate(point, delta);
    yield {
        x0: point.x,
        y0: point.y,
        dir,
        align,
    };
}

function* activeA({ width, height, i, angle, dir, x0: a, y0: b }) {
    const rx = opposite(a, i === 1);
    const ry = opposite(b, i === 1);
    const { x, y } = interp(width, height, rx, ry, dir);
    yield {
        x0: x,
        y0: y,
        dir,
        rotate: angle * Math.PI / 2,
        align: 'middle',
    };
}

function char2({
    start, end, lyric, currentTime, duration = 0.5,
    chi, ctx, ch, x0, y0, rotate, size, params,
}) {
    const inEndTime = chi * (end - start) / lyric.length + start;
    const inStartTime = inEndTime - duration;
    const outStartTime = end;
    const outEndTime = outStartTime + duration;
    if (currentTime < inStartTime) {}
    else if (currentTime < inEndTime) {
        const t = (currentTime - inStartTime) / (inEndTime - inStartTime);
        const opacity = t;
        char({
            ctx, ch, x0, y0,
            size,
            rotate,
            color: Color(params.textColor).alpha(opacity).string(),
            fontFamily: params.fontFamily,
            fontWeight: params.fontWeight,
        });
    } else if (currentTime < outStartTime) {
        char({
            ctx, ch, x0, y0,
            size,
            rotate,
            color: params.textColor,
            fontFamily: params.fontFamily,
            fontWeight: params.fontWeight,
        });
    } else if (currentTime < outEndTime) {
        const t = (currentTime - outStartTime) / (outEndTime - outStartTime);
        const opacity = 1 - t;
        char({
            ctx, ch, x0, y0,
            size,
            rotate,
            color: Color(params.textColor).alpha(opacity).string(),
            fontFamily: params.fontFamily,
            fontWeight: params.fontWeight,
        });
    } else {}
}

random.patch();

const render = ({ width, height, seed, ctx, params, lyric, start, end, currentTime }) => {
    const rng = seedrandom(`${seed}`);
    random.use(rng);

    const modes = _
        .keys(params.modes)
        .filter(key => params.modes[key].enabled);
    if (modes.length === 0) return;
    const mode = pickRandom(modes)[0];

    switch (mode) {
        case 'a': {
            const parts = random.int(1, params.splitMax);
            const dir = pickRandom(['horizontal', 'vertical'])[0];
            const it = split({
                text: lyric,
                parts,
                randomness: 0,
            });
            let chi = 0;
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
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate: 0, size, params,
                        });
                        ++chi;
                    }
                }
            }
            break;
        }
        case 'b': {
            const parts = random.int(1, params.splitMax);
            const dir = pickRandom(['horizontal', 'vertical'])[0];
            const align = pickRandom(['begin', 'end'])[0];
            const position = pickRandom(['left', 'right'])[0];
            const it = split({
                text: lyric,
                parts,
                randomness: 0,
            });
            let chi = 0;
            for (const { i, text } of it) {
                const it = neutral({
                    width, height,
                    size: params.size,
                    lineSpacing: params.modes.b.lineSpacing,
                    i, dir, align, position,
                    x0: 0.2, y0: 0.25,
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
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate: 0, size, params,
                        });
                        ++chi;
                    }
                }
            }
            break;
        }
        case 'c': {
            const parts = 2;
            const dir = pickRandom(['horizontal', 'vertical'])[0];
            const angle = random.float(params.modes.c.minAngle, params.modes.c.maxAngle);
            const it = split({
                text: lyric,
                parts,
                randomness: 0,
            });
            let chi = 0;
            for (const { i, text } of it) {
                const it = activeA({
                    width, height, i, dir, angle,
                    x0: 0.2, y0: 0.25,
                });
                for (const { x0, y0, dir, align, rotate } of it) {
                    const it = font({
                        text, x0, y0,
                        size: params.size,
                        dir, align,
                        spacing: params.letterSpacing,
                        ignoreWhitespaces: true,
                        alignBaseline: false,
                    });
                    for (const { ch, x0, y0, size } of it) {
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate, size, params,
                        });
                        ++chi;
                    }
                }
            }
            break;
        }
        case 'd': {
            let chi = 0;
            let rows, cols;
            do {
                rows = random.int(2, 5);
                cols = random.int(2, 5);
            } while (!(lyric.length > 16 || rows * cols >= lyric.length));
            const it = balancedB({
                text: lyric, rows, cols,
                dist: random.float(params.modes.d.minDist, params.modes.d.maxDist),
                width, height, size: params.size,
            });
            for (const { text, x0, y0, align } of it) {
                const it = font({
                    text, x0, y0,
                    size: params.size,
                    dir: 'horizontal', align,
                    spacing: 0,
                    ignoreWhitespaces: true,
                    alignBaseline: false,
                });
                for (const { ch, x0, y0, size } of it) {
                    char2({
                        start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                        rotate: 0, size, params,
                    });
                    ++chi;
                }
            }
            break;
        }
    }
}

export default render;