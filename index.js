import Color from 'color';
import * as dat from 'dat.gui';

const width = 1920;
const height = 1080;

const container = document.querySelector('#container');
const canvas = document.createElement('canvas');

canvas.width = width;
canvas.height = height;
canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
canvas.style.transformOrigin = 'left top';
container.appendChild(canvas);

const ctx = canvas.getContext('2d');

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

const drawText = (text, x0, y0, {
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

const split = (text, parts, { randomness } = {}) => {
    const step = text.length / parts;
    const deltas = [0, ...new Array(parts - 1).fill(0).map(() => (Math.random() - 0.5) * 2 * randomness), 0];
    const splitted = [];
    for (let i = 0; i < parts; ++i) {
        const begin = Math.round(i * step + deltas[i]);
        const end = Math.round((i + 1) * step + deltas[i + 1]);
        splitted.push(text.substring(begin, end));
    }
    return splitted;
}

const interp = (a, b, dir = 'horizontal') => {
    switch (dir) {
        case 'horizontal': return {
            x: a * width, y: b * height,
        }
        case 'vertical': return {
            x: b * width, y: a * height,
        }
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
    }
}

const balanced = (text, { balancedOptions: { minDist, maxDist }, splitOptions = {}, fontOptions = {} }) => {
    const parts = text.length > 12 ? 2 : choose({ value: 1, weight: 0.7 }, { value: 2, weight: 0.3 });
    const dir = choose('vertical', 'horizontal');
    const dist = uniform(minDist, maxDist);
    split(text, parts, splitOptions).forEach((part, i) => {
        const { x, y } = interp(0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
        drawText(part, x, y, { dir, align: 'middle', ...fontOptions });
    });
}

const clear = ({ color, fade = 1.0 }) => {
    ctx.fillStyle = Color(color).alpha(fade).string();
    ctx.fillRect(0, 0, width, height);
}

const opposite = (n, f) => {
    return f ? 1 - n : n;
}

const neutral = (text, { neutralOptions: { lineSpacing }, splitOptions = {}, fontOptions = {} }) => {
    const parts = 2;
    const dir = choose('vertical', 'horizontal');
    const align = choose('begin', 'end');
    const position = choose('left', 'right');
    const [x0, x1] = choose(
        { value: [0.35, 0.43], weight: 3 },
        { value: [0.25, 0.35], weight: 2 },
        { value: [0.1, 0.25], weight: 1 });
    const x = opposite(uniform(0.1, 0.25), align === 'end');
    const y = opposite(uniform(x0, x1), position === 'right');
    let point = interp(x, y, dir);
    const delta = scatter(fontOptions.size * lineSpacing * (position === 'left' ? 1 : -1), dir, true);
    split(text, parts, splitOptions).forEach((part) => {
        const { x, y } = point;
        drawText(part, x, y, { dir, align, ...fontOptions });
        point = translate(point, delta);
    });
}

const activeA = (text, { activeAOptions: { minAngle, maxAngle}, splitOptions = {}, fontOptions = {} } = {}) => {
    const parts = 2;
    const angle = Math.PI * uniform(minAngle, maxAngle);
    const dir = choose('horizontal', 'vertical');
    const [x0, x1] = choose(
        { value: [0.25, 0.35], weight: 3 },
        { value: [0.35, 0.45], weight: 2 },
        { value: [0.45, 0.50], weight: 0.5 },
    );
    const a = uniform(x0, x1);
    const [y0, y1] = choose(
        { value: [0.15, 0.25], weight: 3 },
        { value: [0.25, 0.4], weight: 2 },
    );
    const b = uniform(y0, y1);
    split(text, parts, splitOptions).forEach((part, i) => {
        const rx = opposite(a, i === 1);
        const ry = opposite(b, i === 1);
        const { x, y } = interp(rx, ry, dir);
        drawText(part, x, y, { dir, rotate: angle, align: 'middle', ...fontOptions });
    })
}

const options = {
    fps: 10,
    clearOptions: {
        color: '#F2F2F2',
        fade: 0.8,
    },
    modes: {
        balanced: true,
        neutral: true,
        activeA: true,
    },
    fontOptions: {
        size: 90,
        color: '#000000',
        fontFamily: 'Hiragino Mincho Pro',
        fontWeight: 900,
        spacing: 0,
        ignoreWhitespaces: true,
        sizeRandomness: 0,
    },
    splitOptions: {
        randomness: 2,
    },
    balancedOptions: {
        minDist: 0.6,
        maxDist: 0.8,
    },
    neutralOptions: {
        lineSpacing: 1.5,
    },
    activeAOptions: {
        minAngle: -0.1,
        maxAngle: 0,
    },
};

const gui = new dat.GUI();
gui.remember(options);

gui.add(options, 'fps', 1, 240);

const clearFolder = gui.addFolder('clear');
clearFolder.addColor(options.clearOptions, 'color');
clearFolder.add(options.clearOptions, 'fade', 0, 1);
clearFolder.open();

const modeFolder = gui.addFolder('modes');
modeFolder.add(options.modes, 'balanced');
modeFolder.add(options.modes, 'neutral');
modeFolder.add(options.modes, 'activeA');
// modeFolder.open();

const fontFolder = gui.addFolder('font');
fontFolder.add(options.fontOptions, 'size', 20, 200);
fontFolder.addColor(options.fontOptions, 'color');
fontFolder.add(options.fontOptions, 'fontFamily');
fontFolder.add(options.fontOptions, 'fontWeight', 100, 900, 100);
fontFolder.add(options.fontOptions, 'spacing', -0.5, 0.5, 0.01);
fontFolder.add(options.fontOptions, 'ignoreWhitespaces');
fontFolder.add(options.fontOptions, 'sizeRandomness', 0, 1, 0.01);
fontFolder.open();

const splitFolder = gui.addFolder('split');
splitFolder.add(options.splitOptions, 'randomness', 0, 3, 0.01);
splitFolder.open();

const balancedFolder = gui.addFolder('balanced');
balancedFolder.add(options.balancedOptions, 'minDist', 0, 1.5, 0.01);
balancedFolder.add(options.balancedOptions, 'maxDist', 0, 1.5, 0.01);

const neutralFolder = gui.addFolder('neutral');
neutralFolder.add(options.neutralOptions, 'lineSpacing', 0.5, 5, 0.01);

const activeAFolder = gui.addFolder('activeA');
activeAFolder.add(options.activeAOptions, 'minAngle', -0.5, 0.5, 0.01);
activeAFolder.add(options.activeAOptions, 'maxAngle', -0.5, 0.5, 0.01);

const frame = () => {
    clear(options.clearOptions);
    const text = choose(
        '被害妄想携帯女子',
        'ジェットブーツで大気圏を突破して',
        '短気呑気男子電気消さないで',
        'ただいま参上！電波シスター☆',
        '千本桜　夜ニ紛レ',
        'にゃん　にゃん　にゃん　ステップ踏んで',
        '太陽曰く燃えよカオス',
        'インターネットが遅いさん',
        'ごめん　ゆずれない　ゆずれない',
    );
    const fn = choose(
        { value: balanced, weight: options.modes.balanced ? 1 : 0 },
        { value: neutral, weight: options.modes.neutral ? 1 : 0 },
        { value: activeA, weight: options.modes.activeA ? 1 : 0 },
    );
    fn(text, options);
    setTimeout(frame, 1000 / options.fps);
}

frame();
