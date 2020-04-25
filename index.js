import Color from 'color';
import * as dat from 'dat.gui';
import seedrandom from 'seedrandom';
import balanced from './balanced';
import neutral from './neutral';
import activeA from './activeA';
import { choose } from './utils';

const width = 1920;
const height = 1080;

const container = document.querySelector('#container');
const canvas = document.createElement('canvas');

canvas.width = width;
canvas.height = height;
canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
canvas.style.transformOrigin = 'left top';
container.appendChild(canvas);

let redraw, seed;
const invalidate = () => { redraw = true; };
const reseed = () => {
    seed = `${new Date().getTime()}`;
}
invalidate();
reseed();
canvas.addEventListener('click', () => {
    reseed();
    invalidate();
});
window.addEventListener('keypress', (e) => {
    if (e.key === ' ') {
        reseed();
        invalidate();
    }
});

const ctx = canvas.getContext('2d');

const clear = ({ color, fade = 1.0 }) => {
    ctx.fillStyle = Color(color).alpha(fade).string();
    ctx.fillRect(0, 0, width, height);
}

const modes = { balanced, neutral, activeA };

const options = {
    fps: 10,
    mode: Object.keys(modes)[0],
    background: '#F2F2F2',
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
};


const gui = new dat.GUI();
gui.remember(options);
gui.add(options, 'mode', Object.keys(modes)).onChange(invalidate);
gui.addColor(options, 'background').onChange(invalidate);

const fontFolder = gui.addFolder('font');
fontFolder.add(options.fontOptions, 'size', 20, 200).onChange(invalidate);
fontFolder.addColor(options.fontOptions, 'color').onChange(invalidate);
fontFolder.add(options.fontOptions, 'fontFamily').onChange(invalidate);
fontFolder.add(options.fontOptions, 'fontWeight', 100, 900, 100).onChange(invalidate);
fontFolder.add(options.fontOptions, 'spacing', -0.5, 0.5, 0.01).onChange(invalidate);
fontFolder.add(options.fontOptions, 'ignoreWhitespaces').onChange(invalidate);
fontFolder.add(options.fontOptions, 'sizeRandomness', 0, 1, 0.01).onChange(invalidate);
fontFolder.open();

const splitFolder = gui.addFolder('split');
splitFolder.add(options.splitOptions, 'randomness', 0, 3, 0.01).onChange(invalidate);
splitFolder.open();

const inflated = {};
for (const key in modes) {
    inflated[key] = modes[key]({ gui, ctx, invalidate, width, height });
}

const frame = () => {
    if (redraw) {
        redraw = false;
        seedrandom(seed, { global: true });
        clear({ color: options.background });
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
        const render = inflated[options.mode].render;
        Object.keys(inflated).map(key => inflated[key].folder).forEach(f => f.hide());
        inflated[options.mode].folder.show();
        render(text, options);
    }
    requestAnimationFrame(frame);
}
frame();
