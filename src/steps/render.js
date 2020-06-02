/* eslint-disable default-case, no-fallthrough */

import * as _ from 'lodash';
import pickRandom from 'pick-random';
import random from 'random';
import seedrandom from 'seedrandom';
import Color from 'color';
import inside from 'point-in-polygon';
import BezierEasing from 'bezier-easing';

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
    // pattern
    patternType, ctx, currentTime, start, end, params,
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

    if (patternType === 'follow') {
        const x0 = x, y0 = y;
        const x1 = x + (dir === 'horizontal' ? width : 0);
        const y1 = y + (dir === 'vertical' ? width : 0);
        const t = random.float(0, 1);
        pattern({
            ctx, currentTime, start, end, params,
            x0: x0 * (1 - t) + x1 * t,
            y0: y0 * (1 - t) + y1 * t,
            size: params.size * 1.5,
        });
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

const distToShape = ({ x: x1, y: y1, r: r1 }, { x: x2, y: y2 }) => {
    // Chebyshev distance
    const dist = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    return dist - r1;
}

const distToLine = ({ x: x1, y: y1 }, { x: x2, y: y2 }, { x, y }) => {
    // euclidian distance to line
    const dist = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
        / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1);
    return Math.abs(dist / Math.sin(angle + Math.PI / 4)) / Math.sqrt(2);
}

const dist = (bounds, shapes, point) => {
    let dist = shapes
        .map(shape => distToShape(shape, point))
        .reduce((a, b) => Math.min(a, b), 100000);
    for (let i = 0; i < bounds.length; ++i) {
        const p1 = bounds[i], p2 = bounds[(i + 1) % bounds.length];
        const newDist = distToLine(p1, p2, point);
        if (newDist < dist) dist = newDist;
    }
    return dist;
}

const bestCandidate = (bounds, { tries, width, height, maxR, minR = 0 }) => {
    const shapes = [];
    const polygon = bounds.map(({ x, y }) => [x, y]);
    for (let i = 0; i < tries; ++i) {
        const x = random.float(0, width);
        const y = random.float(0, height);
        if (!inside([x, y], polygon)) continue;
        const d = Math.min(maxR, dist(bounds, shapes, { x, y }));
        if (d <= minR) continue;
        shapes.push({ x, y, r: d });
    }
    return shapes;
}

const sort = (chosen, { debug, angle, scale }) => {
    const chains = [];
    chosen = chosen.sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) => (x1 + y1) - (x2 + y2));
    while (chosen.length > 0) {
        // characters that is on the leftmost must be beginning of chain
        const chain = [];
        chain.push(chosen.splice(0, 1)[0]);
        while (true) {
            const { x: x1, y: y1, r: r1 } = chain[chain.length - 1];
            const candidates = [...chosen]
                .map((shape, i) => ({ ...shape, i }))
                .map(({ x: x2, y: y2, r: r2, i }) => ({
                    x: x2, y: y2, r: r2, i,
                    s: Math.abs(Math.atan2(-(y2 - y1), x2 - x1)) / angle,
                    d: (x2 - x1) / r1 / scale,
                }))
                .filter(({ s }) => s < 1)
                .map(({ d, s, ...rest }) => ({
                    ...rest,
                    k: s + d,
                }))
                .sort(({ k: k1 }, { k: k2 }) => k1 - k2);
            if (candidates.length === 0) break;
            chain.push(chosen.splice(candidates[0].i, 1)[0]);
        }
        chains.push(chain);
    }
    return chains
        .sort(([{ y: y1 }], [{ y: y2 }]) => y1 - y2)
        .reduce((a, b) => [...a, ...b], []);
}

function* activeB({ width, height, text, tries, size, minR, sort: shouldSort, sortAngle, sortScale, dimension }) {
    text = text.split(/\s+/).join('');
    const bounds = [
        { x: width * dimension.x0, y: height * dimension.y0 },
        { x: width * dimension.x1, y: height * dimension.y0 },
        { x: width * dimension.x1, y: height * dimension.y1 },
        { x: width * dimension.x0, y: height * dimension.y1 },
    ];
    const shapes = bestCandidate(bounds, {
        tries,
        width,
        height,
        maxR: size,
        minR: size * minR,
    });

    // applySeed();
    const chosen = pickRandom(shapes, { count: Math.min(shapes.length, text.length) });
    const sorted = shouldSort
        ? sort(chosen, { angle: sortAngle * Math.PI, scale: sortScale })
        : chosen;
    for (let i = 0; i < sorted.length; ++i) {
        const { x, y, r } = sorted[i];
        yield {
            i,
            text: text[i],
            x0: x,
            y0: y,
            size: r * 2,
            align: 'middle',
        };
    }
}

function pattern({
    ctx, x0, y0, currentTime, start, end, duration = 0.5, params, size,
}) {
    const rotation = currentTime * 1;
    const easing1 = BezierEasing(0.22, 1, 0.36, 1);
    const easing2 = BezierEasing(0.64, 0, 0.78, 0);
    let t = 0;
    if (currentTime < start) t = 0;
    else if (currentTime < start + duration) t = easing1((currentTime - start) / duration);
    else if (currentTime < end - duration) t = 1;
    else if (currentTime < end) t = 1 - easing2(1 - (end - currentTime) / duration);
    else t = 0;
    ctx.save();
    ctx.fillStyle = params.pattern.color;
    ctx.translate(x0, y0);
    const scale = t * size / 2;
    ctx.scale(scale, scale);
    const shape = params.pattern.shape;
    if (shape !== 'line') ctx.rotate(rotation);
    switch (params.pattern.shape) {
        case 'square': case 'triangle': case 'pentagon': {
            const sides = { square: 4, triangle: 3, pentagon: 5 }[params.pattern.shape];
            ctx.beginPath();
            ctx.moveTo(1, 0);
            for (let i = 0; i < sides; ++i) {
                const angle = Math.PI * 2 / sides * (i + 1);
                ctx.lineTo(Math.cos(angle), Math.sin(angle));
            }
            ctx.fill();
            break;
        }
        case 'circle': {
            ctx.beginPath();
            ctx.arc(0, 0, 1, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case 'line': {
            ctx.beginPath();
            ctx.moveTo(+1.5, -0.2);
            ctx.lineTo(+1.5, +0.2);
            ctx.lineTo(-1.5, +0.2);
            ctx.lineTo(-1.5, -0.2);
            ctx.fill();
            break;
        }
    }
    ctx.restore();
}

function char2({
    start, end, lyric, currentTime, duration = 0.5,
    chi, ctx, ch, x0, y0, rotate, size, params, outEffect, inEffect,
}) {
    const inEndTime = chi * (end - duration - start) / lyric.length + start;
    const inStartTime = inEndTime - duration;
    const outStartTime = end - duration;
    const outEndTime = outStartTime + duration;
    if (currentTime < inStartTime) { }
    else if (currentTime < inEndTime) {
        const t = (currentTime - inStartTime) / (inEndTime - inStartTime);
        switch (inEffect) {
            case 'fade': {
                const opacity = t;
                char({
                    ctx, ch, x0, y0,
                    size,
                    rotate,
                    color: Color(params.textColor).alpha(opacity).string(),
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
            case 'blink': {
                const thres = 0.2;
                const opacity = t < thres ? 1 : (t - thres) / (1 - thres);
                char({
                    ctx, ch, x0, y0,
                    size,
                    rotate,
                    color: Color(params.textColor).alpha(opacity).string(),
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
            case 'zoom': {
                const easing = BezierEasing(0.22, 1, 0.36, 1);
                char({
                    ctx, ch, x0, y0,
                    size: size * easing(t),
                    rotate,
                    color: params.textColor,
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
            case 'slide': {
                const easing = BezierEasing(0.22, 1, 0.36, 1);
                const k = 1 - easing(t);
                const dx = 0, dy = -1;
                char({
                    ctx, ch, x0: x0 + dx * size * k, y0: y0 + dy * size * k,
                    size,
                    rotate,
                    color: params.textColor,
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
        }
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
        switch (outEffect) {
            case 'fade': {
                const opacity = 1 - t;
                char({
                    ctx, ch, x0, y0,
                    size,
                    rotate,
                    color: Color(params.textColor).alpha(opacity).string(),
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
            case 'blink': {
                const thres = 0.2;
                const opacity = 1 - (t < thres ? 1 : (t - thres) / (1 - thres));
                char({
                    ctx, ch, x0, y0,
                    size,
                    rotate,
                    color: Color(params.textColor).alpha(opacity).string(),
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
            case 'zoom': {
                const easing = BezierEasing(0.64, 0, 0.78, 0);
                char({
                    ctx, ch, x0, y0,
                    size: size * (1 - easing(t)),
                    rotate,
                    color: params.textColor,
                    fontFamily: params.fontFamily,
                    fontWeight: params.fontWeight,
                });
                break;
            }
        }
    } else { }
}

random.patch();

const render = ({ width, height, seed, ctx, params, lyric, start, end, currentTime }) => {
    if (lyric.length === 0) return;

    const rng = seedrandom(`${seed}`);
    random.use(rng);

    const modes = _
        .keys(params.modes)
        .filter(key => params.modes[key].enabled);
    if (modes.length === 0) return;
    const mode = pickRandom(modes)[0];

    const inEffect = pickRandom(['fade', 'blink', 'zoom', 'slide'])[0];
    const outEffect = pickRandom(['fade', 'blink', 'zoom'])[0];

    const patternType = pickRandom(['center', 'follow', 'random'].filter(type => params.pattern[type].enabled))[0];
    switch (patternType) {
        case 'center': {
            pattern({
                ctx, currentTime, start, end, params,
                x0: width / 2, y0: height / 2,
                size: params.size * 2,
            });
            break;
        }
        case 'follow': {
            if (['a', 'b', 'c'].indexOf(mode) !== -1) break;
            // intended fall through
        }
        case 'random': {
            const num = random.int(7, 16);
            for (let i = 0; i < num; ++i) {
                const x0 = random.float(0, 1) * width;
                const y0 = random.float(0, 1) * height;
                const size = random.float(0.4, 1.0) * params.size;
                pattern({
                    ctx, x0, y0, currentTime, start, end, params, size,
                });
            }
            break;
        }
    }

    switch (mode) {
        case 'a': {
            const parts = Math.max(random.int(1, params.splitMax), Math.ceil(lyric.length / 12));
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

                        ctx, patternType, currentTime, start, end, params,
                    });
                    for (const { ch, x0, y0, size } of it) {
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate: 0, size, params, inEffect, outEffect,
                        });
                        ++chi;
                    }
                }
            }
            break;
        }
        case 'b': {
            const parts = Math.max(random.int(1, params.splitMax), Math.ceil(lyric.length / 12));
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

                        ctx, patternType, currentTime, start, end, params,
                    });
                    for (const { ch, x0, y0, size } of it) {
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate: 0, size, params, inEffect, outEffect,
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

                        ctx, patternType, currentTime, start, end, params,
                    });
                    for (const { ch, x0, y0, size } of it) {
                        char2({
                            start, end, lyric, currentTime, chi, ctx, ch, x0, y0,
                            rotate, size, params, inEffect, outEffect,
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
                if (lyric.length > 20) {
                    rows = 4;
                    cols = 5;
                } else {
                    rows = random.int(2, 4);
                    cols = random.int(2, 5);
                }
            } while (!(lyric.length > 20 || rows * cols >= lyric.length));
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
                        rotate: 0, size, params, inEffect, outEffect,
                    });
                    ++chi;
                }
            }
            break;
        }
        case 'e': {
            const it = activeB({
                text: lyric, width, height,
                tries: 5000, size: params.size,
                minR: params.modes.e.minR,
                sort: true, sortAngle: 0.2, sortScale: 3.0,
                dimension: { x0: 0.2, x1: 0.8, y0: 0.15, y1: 0.85 },
            });
            for (const { i, text, x0, y0, size, align } of it) {
                const it = font({
                    text, x0, y0, size: size * params.modes.e.scale,
                    dir: 'horizontal', align,
                    spacing: 0,
                    ignoreWhitespaces: true,
                    alignBaseline: false,
                });
                for (const { ch, x0, y0, size } of it) {
                    char2({
                        start, end, lyric, currentTime, chi: i, ctx, ch, x0, y0,
                        rotate: 0, size, params, inEffect, outEffect,
                    });
                }
            }
            break;
        }
    }
}

export default render;