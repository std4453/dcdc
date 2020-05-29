import { BeanComponent } from '../../retex/components';

class CanvasComponent extends BeanComponent {
    constructor() {
        super(
            'Canvas',
            {
                width: { defaultVal: 1920, min: 360, max: 2160 },
                height: { defaultVal: 1080, min: 240, max: 1920 },
                background: { type: 'color', defaultVal: '#F2F2F2' },
            },
            {
                ctx: { type: 'canvas' },
            },
        );
    }

    async * worker({ width, height, background }, __, { canvas }) {
        // canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
        yield { ctx };
    }
}

export default CanvasComponent;
