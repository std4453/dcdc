import { BeanComponent } from '../retex/components';

const container = document.querySelector('#container');
const canvas = document.createElement('canvas');
canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

class CanvasComponent extends BeanComponent {
    constructor() {
        super(
            'Canvas',
            {
                width: { defaultVal: 1920 },
                height: { defaultVal: 1080 },
                background: { type: 'color', defaultVal: '#F2F2F2' },
            },
            {
                ctx: { type: 'canvas' },
            },
        );
    }

    exec({ width, height, background }) {
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
        return { ctx };
    }
}

export default CanvasComponent;
