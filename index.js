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

const init = () => {
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

    const options = {
        fps: 10,
        mode: modes[0],
        background: '#F2F2F2',
    };

    const gui = new dat.GUI();
    gui.add(options, 'mode', modes).onChange(invalidate);
    gui.addColor(options, 'background').onChange(invalidate);

    const inflated = {};
    for (const key in modules) {
        inflated[key] = modules[key]({ gui, ctx, invalidate, width, height, inflated });
    }

    const frame = () => {
        if (redraw) {
            redraw = false;
            seedrandom(seed, { global: true });
            ctx.fillStyle = Color(options.background).string();
            ctx.fillRect(0, 0, width, height);
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
            const render = inflated[options.mode].fn;
            modes.map(key => inflated[key].folder).forEach(f => f.hide());
            inflated[options.mode].folder.show();
            render(text, options);
        }
        requestAnimationFrame(frame);
    }
    frame();
}

init();
