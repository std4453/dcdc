import pickRandom from 'pick-random';

const container = document.querySelector('#container');
const canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
canvas.style.transform = 'scale(0.5)';
canvas.style.transformOrigin = 'left top';
container.appendChild(canvas);

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
ctx.fillRect(0, 0, 1920, 1080);
ctx.fillStyle = '#000';

const type1 = () => {
    ctx.font = 'bold 60px \'Hiragino Mincho Pro\'';
    const text = '被害妄想携帯女子';
    pickRandom(new Array(5)
        .fill(0)
        .map((_, x) => new Array(3).fill(0).map((_, y) => [x, y]))
        .reduce((a, b) => [...a, ...b], [])
        .map(([x, y]) => [x * 120 + 240 - 30, y * 120 + 160]), { count: text.length })
        .sort(([x1, y1], [x2, y2]) => (y1 === y2 ? (x1 - x2) : (y1 - y2)))
        .map(([x, y]) => ({ x, y }))
        .forEach(({ x, y }, n) => ctx.fillText(text.charAt(n), x, y));
};

const type2 = () => {
    const size = 130;
    // ctx.translate(-480, -270);
    ctx.rotate(-7 * Math.PI / 180);
    ctx.translate(480, 270);
    const text = '被害妄想携帯女子';
    ctx.font = `bold ${size}px \'Hiragino Mincho Pro\'`;
    text.split('').forEach((ch, n) => {
        const x = size * (n - text.length / 2) - 30;
        const y = (Math.random() - 0.5) * 30 + Math.pow(-1, n) * 40 + 80;
        ctx.fillText(ch, x, y);
    });
}

const type3 = () => {
    const text = '被害妄想携帯女子';
    ctx.font = 'bold 60px \'Hiragino Mincho Pro\'';
    for (const type of type.split('')) {
        
    }
}

// type1();

const f4 = () => {
    const cnt = 500000;
    const maxSize = 40, minSize = 6;
    const circles = [];
    const getDist = ({ x: x0, y: y0 }) => {
        const circleDist = circles
            .map(({ x: x1, y: y1, r }) => Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)) - r)
            .reduce((a, b) => Math.min(a, b), 1000000);
        const rectDist = [x0, y0, 960 - x0, 540 - y0].reduce((a, b) => Math.min(a, b));
        return Math.min(maxSize, Math.min(circleDist, rectDist));
    }
    ctx.fillStyle = '#000';
    for (let i = 0; i < cnt; ++i) {
        const x = Math.random() * 960;
        const y = Math.random() * 540;
        const r = getDist({ x, y });
        if (r > minSize) {
            circles.push({ x, y, r });
            ctx.beginPath();
            ctx.arc(x, y, r - 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// f4();

const f5 = () => {
    const cnt = 500000;
    const maxSize = 60, maxSizeRand = 40, minSize = 12, scale = 1.3;
    const circles = [];
    const getDist = ({ x: x0, y: y0 }, maxSize) => {
        const circleDist = circles
            .map(({ x: x1, y: y1, r }) => Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) - r)
            .reduce((a, b) => Math.min(a, b), 1000000);
        // const rectDist = [x0, y0, 960 - x0, 540 - y0].reduce((a, b) => Math.min(a, b));
        // return Math.min(maxSize, Math.min(circleDist, rectDist));
        return Math.min(maxSize, circleDist);
    }
    const text = `
        頓珍漢
        消化器官対毒性
        暴飲暴食
        昏倒寸前
        妄言多謝
        悪酔強酒之弁
        触即発
        前後不覚
        無限地獄後
        理論武装
        自問自答
    `.split(/\s+/).join('');
    for (let i = 0; i < cnt; ++i) {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        const r = getDist({ x, y }, maxSize + Math.random() * maxSizeRand);
        if (r > minSize) {
            circles.push({ x, y, r });
            const s = r * scale - 4;
            // const gray = (s / 70 + 0.5) * 255;
            ctx.fillStyle = `rgb(0, 0, 0, ${(Math.pow(s / 140 + 0.3, 1.4))})`;
            ctx.font = `bold ${s * 2}px \'Hiragino Mincho Pro\'`;
            ctx.fillText(text[~~(Math.random() * text.length)], x - s, y + s * 0.7);
        }
    }
}

// f5();

const f6 = () => {
    const cnt = 1000;
    const maxSize = 40, minSize = 12;
    const circles = [];
    const getDist = ({ x: x0, y: y0 }, maxSize) => {
        const circleDist = circles
            .map(({ x: x1, y: y1, r }) => Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) - r)
            .reduce((a, b) => Math.min(a, b), 1000000);
        // const rectDist = [x0, y0, 960 - x0, 540 - y0].reduce((a, b) => Math.min(a, b));
        // return Math.min(maxSize, Math.min(circleDist, rectDist));
        return Math.min(maxSize, circleDist);
    }
    const text = `
        頓珍漢
        消化器官対毒性
        暴飲暴食
        昏倒寸前
        妄言多謝
        悪酔強酒之弁
        触即発
        前後不覚
        無限地獄後
        理論武装
        自問自答
    `.split(/\s+/).join('');
    for (let i = 0; i < cnt; ++i) {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        const r = Math.pow(Math.random(), 3) * 60 + 10;
        if (r > minSize) {
            // circles.push({ x, y, r });
            const s = r * 1.3 - 4;
            // const gray = (s / 70 + 0.5) * 255;
            ctx.fillStyle = `rgb(0, 0, 0, ${(Math.pow(s / 140 + 0.3, 1.4))})`;
            ctx.font = `bold ${s * 2}px \'Hiragino Mincho Pro\'`;
            ctx.fillText(text[~~(Math.random() * text.length)], x - s, y + s * 0.7);
        }
    }
}

// f6();

const drawText = (text, x, y, { size = 20, dir = 'horizontal', color = '#000'} = {}) => {
    ctx.textBaseline = { horizontal: 'middle', vertical: 'top' }[dir];
    ctx.textAlign = { horizontal: 'start', vertical: 'center' }[dir];
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px \'Hiragino Mincho Pro\'`;
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

const split = (text, parts) => {
    const step = text.length / parts;
    const splitted = [];
    for (let i = 0; i < parts; ++i) {
        const begin = Math.round(i * step);
        const end = Math.round((i + 1) * step);
        splitted.push(text.substring(begin, end));
    }
    return splitted;
}

const width = 1920;
const height = 1080;

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

const scatter = (val, dir, opposite = false) => {
    if (opposite) dir = { vertical: 'horizontal', horizontal: 'vertical' }[dir];
    switch (dir) {
        case 'horizontal': return {
            x: val, y: 0,
        }
        case 'vertical': return {
            x: 0, y: val,
        }
    }
}

const balanced = (text, { size = 90 } = {}) => {
    const parts = choose({ value: 1, weight: 0.7 }, { value: 2, weight: 0.3 });
    const dir = choose('vertical', 'horizontal');
    const dist = uniform(0.6, 0.8);
    split(text, parts).forEach((part, i) => {
        const p1 = interp(0.5, (divide(parts, i) - 0.5) * dist + 0.5, dir);
        const p2 = scatter(-part.length * size / 2, dir);
        const { x, y } =  translate(p1, p2);
        drawText(part, x, y, { size, dir });
    });
}

const clear = () => {
    ctx.fillStyle = 'rgb(242, 242, 242)';
    ctx.fillRect(0, 0, width, height);
}

setInterval(() => {
    clear();
    const text = choose(
        '被害妄想携帯女子',
        'ジェットブーツで大気圏を突破して',
        '短気呑気男子電気消さないで',
        'ただいま参上！電波シスター☆',
    );
    balanced(text);
}, 100);