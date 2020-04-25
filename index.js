const container = document.querySelector('#container');
const canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
canvas.style.transform = 'scale(0.5)';
canvas.style.transformOrigin = 'left top';
container.appendChild(canvas);

const ctx = canvas.getContext('2d');

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