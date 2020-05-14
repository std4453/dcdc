import { BeanComponent } from '../retex/components';
import inside from 'point-in-polygon';
import pickRandom from 'pick-random';
import { uniform } from '../utils';

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


class ActiveBComponent extends BeanComponent {
    constructor() {
        super(
            'ActiveB',
            {
                width: { type: 'number' },
                height: { type: 'number' },
                text: { type: 'string' },
                size: { type: 'number' },
                dimension: { type: 'dimension' },
                tries: { defaultVal: 10000, min: 100, max: 50000, step: 100 },
                minR: { defaultVal: 0.78, min: 0, max: 1 },
                sort: { defaultVal: true },
                sortAngle: { defaultVal: 0.2, min: 0, max: 0.5 },
                sortScale: { defaultVal: 3.0, min: 0, max: 10 },
            },
            {
                i: { type: 'number' },
                text: { type: 'string' },
                x0: { type: 'number' },
                y0: { type: 'number' },
                size: { type: 'number' },
                align: { type: 'string' },
            },
        );
    }

    async * worker({ width, height, text, tries, size, minR, sort: shouldSort, sortAngle, sortScale, dimension }) {
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
}

export default ActiveBComponent;
