const interp = (width, height, a, b, dir = 'horizontal') => {
    switch (dir) {
        case 'horizontal': return {
            x: a * width, y: b * height,
        }
        case 'vertical': return {
            x: b * width, y: a * height,
        }
        default: return { x: 0, y: 0 };
    }
}

const divide = (parts, i) => {
    return 1 / (parts + 1) * (i + 1);
}

const uniform = (min, max) => {
    return Math.random() * (max - min) + min;
}

const translate = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
    return { x: x1 + x2, y: y1 + y2 };
}

const scatter = (val, dir, opposite = false, mirrored = false) => {
    if (opposite) dir = { vertical: 'horizontal', horizontal: 'vertical' }[dir];
    switch (dir) {
        case 'horizontal': return {
            x: mirrored ? -val : val, y: 0,
        }
        case 'vertical': return {
            x: 0, y: val,
        }
        default: return { x: 0, y: 0 };
    }
}

const opposite = (n, f) => {
    return f ? 1 - n : n;
}

const choose = (...choices) => {
    choices = choices.map(v => typeof v === 'object' ? v : { value: v });
    const sum = choices.map(({ weight = 1 }) => weight).reduce((a, b) => a + b);
    let n = Math.random() * sum;
    for (const { value, weight = 1 } of choices) {
        if (weight >= n) return value;
        else n -= weight;
    }
    return choices[choices.length - 1].value;
}

export { interp, divide, uniform, scatter, translate, opposite, choose };
