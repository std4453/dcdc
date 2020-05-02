import { BeanComponent } from '../retex/components';

class UniformComponent extends BeanComponent {
    constructor() {
        super(
            'Uniform',
            {
                min: { defaultVal: -0.5, min: -1, max: 1 },
                max: { defaultVal: 0.5, min: -1, max: 1 },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    exec({ min, max }) {
        return {
            val: min + Math.random() * (max - min),
        };
    }
}

export default UniformComponent;
