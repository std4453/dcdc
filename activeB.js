import inside from 'point-in-polygon';
import { uniform } from './utils';
import pickRandom from 'pick-random';

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
        const x = uniform(0, width);
        const y = uniform(0, height);
        if (!inside([x, y], polygon)) continue;
        const d = Math.min(maxR, dist(bounds, shapes, { x, y }));
        if (d <= minR) continue;
        shapes.push({ x, y, r: d });
    }
    return shapes;
}

const sort = (chosen, { ctx, debug, angle, scale }) => {
    const chains = [];
    chosen = chosen.sort(({ x: x1, y: y1 }, { x: x2, y: y2 }) => (x1 + y1) - (x2 + y2));
    while (chosen.length > 0) {
        // characters that is on the leftmost must be beginning of chain
        const chain = [];
        chain.push(chosen.splice(0, 1)[0]);
        while (true) {
            const { x: x1, y: y1, r: r1 } = chain[chain.length - 1];
            if (debug) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + scale * r1, y1 + scale * r1 * Math.tan(angle));
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1 + scale * r1, y1 - scale * r1 * Math.tan(angle));
                ctx.stroke();
            }
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
            if (debug) {
                ctx.strokeStyle = 'rgba(0, 0, 255, 0.6)';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(candidates[0].x, candidates[0].y);
                ctx.stroke();
            }
            chain.push(chosen.splice(candidates[0].i, 1)[0]);
        }
        chains.push(chain);
    }
    return chains
        .sort(([{ y: y1 }], [{ y: y2 }]) => y1 - y2)
        .reduce((a, b) => [...a, ...b], []);
}

export default ({
    gui, invalidate, width, height, ctx, applySeed,
    inflated: { drawText: { fn: drawText, options: fontOptions } },
}) => {
    const options = {
        minR: 0.78,
        x0: 0.25,
        x1: 0.75,
        y0: 0.2,
        y1: 0.8,
        tries: 10000,
        scale: 1.0,
        sortAngle: 0.2,
        sortScale: 3,
        debug: false,
    };

    const folder = gui.addFolder('activeB');
    folder.add(options, 'minR', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'x0', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'x1', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'y0', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'y1', 0, 1, 0.01).onChange(invalidate);
    folder.add(options, 'tries', 100, 50000, 100).onChange(invalidate);
    folder.add(options, 'scale', 0, 2, 0.01).onChange(invalidate);
    folder.add(options, 'sortAngle', 0, 0.5, 0.01).onChange(invalidate);
    folder.add(options, 'sortScale', 0, 10, 0.01).onChange(invalidate);
    folder.add(options, 'debug').onChange(invalidate);
    folder.open();

    const fn = (text) => {
        text = text.split(/\s+/).join('');
        const bounds = [
            { x: width * options.x0, y: height * options.y0 },
            { x: width * options.x1, y: height * options.y0 },
            { x: width * options.x1, y: height * options.y1 },
            { x: width * options.x0, y: height * options.y1 },
        ];
        const shapes = bestCandidate(bounds, {
            tries: options.tries,
            width,
            height,
            maxR: fontOptions.size,
            minR: fontOptions.size * options.minR,
        });

        if (options.debug) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            for (const { x, y, r } of shapes) {
                ctx.strokeRect(x - r, y - r, r * 2, r * 2);
            }
        }

        applySeed();
        const chosen = pickRandom(shapes, { count: Math.min(shapes.length, text.length) });
        const sorted = sort(chosen, { ctx, debug: options.debug, angle: options.sortAngle * Math.PI, scale: options.sortScale });
        sorted.forEach(({ x, y, r }, i) => {
            drawText(text[i], x, y, { size: r * 2 * options.scale, align: 'middle' });
        });
    };

    return { options, folder, fn };
}
