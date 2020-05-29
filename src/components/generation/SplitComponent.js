import { BeanComponent } from '../BeanComponent';

class SplitComponent extends BeanComponent {
    constructor() {
        super(
            'Split',
            {
                text: { defaultVal: '被害妄想携帯女子' },
                parts: { defaultVal: 2, min: 1, max: 5, step: 1 },
                randomness: { defaultVal: 2, min: 0, max: 4, },
            },
            {
                parts: { type: 'number' },
                i: { type: 'number' },
                text: { type: 'string' },
            },
        );
    }

    async * worker({ text, parts, randomness }) {
        const step = text.length / parts;
        const deltas = [0, ...new Array(parts - 1).fill(0).map(() => (Math.random() - 0.5) * 2 * randomness), 0];
        for (let i = 0; i < parts; ++i) {
            const begin = Math.round(i * step + deltas[i]);
            const end = Math.round((i + 1) * step + deltas[i + 1]);
            yield {
                parts,
                i,
                text: text.substring(begin, end),
            };
        }
    }
}

export default SplitComponent;
