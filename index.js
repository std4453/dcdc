import Color from 'color';
import * as dat from 'dat.gui';
import seedrandom from 'seedrandom';
import balanced from './balanced';
import neutral from './neutral';
import activeA from './activeA';
import drawText from './text';
import split from './split';
import { choose } from './utils';

const width = 1920, height = 1080;
const modules = { drawText, split, balanced, neutral, activeA };
const modes = ['balanced', 'neutral', 'activeA'];
const exampleText = [
    '被害妄想携帯女子',
    'ジェットブーツで大気圏を突破して',
    '短気呑気男子電気消さないで',
    'ただいま参上！電波シスター☆',
    '千本桜　夜ニ紛レ',
    'にゃん　にゃん　にゃん　ステップ踏んで',
    '太陽曰く燃えよカオス',
    'インターネットが遅いさん',
    'ごめん　ゆずれない　ゆずれない',
];

const init = () => {
    const container = document.querySelector('#container');
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const invalidate = () => { rerender(); };
    let seed;
    const reseed = () => {
        seed = `${new Date().getTime()}`;
    }
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

    const options = {
        mode: modes[0],
        background: '#F2F2F2',
        text: '',
    };
    const gui = new dat.GUI();
    gui.add(options, 'mode', modes).onChange(invalidate);
    gui.addColor(options, 'background').onChange(invalidate);
    gui.add(options, 'text').onChange(invalidate);

    // initialize modules
    const inflated = {};
    for (const key in modules) {
        inflated[key] = modules[key]({ gui, ctx, invalidate, width, height, inflated });
    }

    const rerender = () => {
        seedrandom(seed, { global: true });
        ctx.fillStyle = Color(options.background).string();
        ctx.fillRect(0, 0, width, height);
        const randomText = choose(...exampleText);
        const text = options.text !== '' ? options.text : randomText;
        const render = inflated[options.mode].fn;
        modes.map(key => inflated[key].folder).forEach(f => f.hide());
        inflated[options.mode].folder.show();
        render(text, options);
    };

    invalidate();
    reseed();
}

init();
