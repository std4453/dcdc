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

const drawText = (text, x0, y0, {
    size = 20, dir = 'horizontal', align = 'begin', color = '#000', rotate = 0,
    fontFamily = 'Hiragino Mincho Pro', fontWeight = 900,
} = {}) => {
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(rotate);
    let x = 0, y = 0;
    if (align === 'middle') {
        switch (dir) {
            case 'horizontal':
                x -= size * text.length / 2;
                break;
            case 'vertical':
                y -= size * text.length / 2;
                break;
        }
    }
    if (align === 'end') {
        switch (dir) {
            case 'horizontal':
                x -= size * text.length;
                break;
            case 'vertical':
                y -= size * text.length;
                break;
        }
    }
    ctx.textBaseline = { horizontal: 'middle', vertical: 'top' }[dir];
    ctx.textAlign = { horizontal: 'start', vertical: 'center' }[dir];
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${size}px \'${fontFamily}\'`;
    for (const ch of text.split('')) {
        ctx.fillText(ch, x, y);
        switch (dir) {
            case 'horizontal':
                x += size;
                break;
            case 'vertical':
                y += size;
                break;
        }
    }
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

const split = (text, parts, { randomness = 2 } = {}) => {
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

const balanced = (text, { size, splitOptions = {}, fontOptions = {} }) => {
    const parts = text.length > 12 ? 2 : choose({ value: 1, weight: 0.7 }, { value: 2, weight: 0.3 });
    const dir = choose('vertical', 'horizontal');
    const dist = uniform(0.6, 0.8);
    split(text, parts, splitOptions).forEach((part, i) => {
        const { x, y } = interp(0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
        drawText(part, x, y, { size, dir, align: 'middle', ...fontOptions });
    });
}

const clear = ({ color, fade = 1.0 }) => {
    ctx.fillStyle = Color(color).alpha(fade).string();
    ctx.fillRect(0, 0, width, height);
}

const opposite = (n, f) => {
    return f ? 1 - n : n;
}

const neutral = (text, { size, splitOptions = {}, fontOptions = {} }) => {
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
    const delta = scatter(size * 1.5 * (position === 'left' ? 1 : -1), dir, true);
    split(text, parts, splitOptions).forEach((part) => {
        const { x, y } = point;
        drawText(part, x, y, { size, dir, align, ...fontOptions });
        point = translate(point, delta);
    });
}

const activeA = (text, { size, splitOptions = {}, fontOptions = {} } = {}) => {
    const parts = 2;
    const angle = Math.PI * uniform(-0.1, 0);
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
        drawText(part, x, y, { size, dir, rotate: angle, align: 'middle', ...fontOptions });
    })
}

const options = {
    size: 90,
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
        color: '#000000',
        fontFamily: 'Hiragino Mincho Pro',
        fontWeight: 900,
    },
};

const gui = new dat.GUI();
gui.add(options, 'size', 20, 200);
gui.add(options, 'fps', 1, 240);

const clearFolder = gui.addFolder('Clear');
clearFolder.addColor(options.clearOptions, 'color');
clearFolder.add(options.clearOptions, 'fade', 0, 1);
clearFolder.open();

const modeFolder = gui.addFolder('Modes');
modeFolder.add(options.modes, 'balanced');
modeFolder.add(options.modes, 'neutral');
modeFolder.add(options.modes, 'activeA');
modeFolder.open();

const fontFolder = gui.addFolder('Font');
fontFolder.addColor(options.fontOptions, 'color');
fontFolder.add(options.fontOptions, 'fontFamily');
fontFolder.add(options.fontOptions, 'fontWeight', 100, 900, 100);
fontFolder.open();

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
