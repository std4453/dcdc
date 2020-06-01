import { BeanComponent } from '../BeanComponent';

class CharComponent extends BeanComponent {
    constructor() {
        super(
            'Char',
            {
                ctx: { type: 'canvas', required: true },
                ch: { defaultVal: '' },
                x0: { defaultVal: 960, min: -1000, max: 3000 },
                y0: { defaultVal: 540, min: -1000, max: 3000 },
                size: { defaultVal: 90, min: 10, max: 400 },
                rotate: { defaultVal: 0, min: -1, max: 1 },
                color: { defaultVal: '#000000', type: 'color' },
                fontFamily: { defaultVal: 'Hiragino Mincho Pro' },
                fontWeight: { defaultVal: 900, min: 100, max: 900, step: 100 },
            },
            {},
        );
    }

    * worker({
        ctx, ch, x0, y0,
        size, rotate, color,
        fontFamily, fontWeight,
    }) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${size}px '${fontFamily}'`;
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(rotate * Math.PI);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
        yield;
    }
}

export default CharComponent;
