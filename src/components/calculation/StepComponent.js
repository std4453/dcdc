import { BeanComponent } from '../BeanComponent';

class StepComponent extends BeanComponent {
    constructor() {
        super(
            'Step',
            {
                i: { defaultVal: 0 },
                start: { defaultVal: 0, min: -1, max: 1 },
                step: { defaultVal: 0.1, min: -1, max: 1 },
            },
            {
                val: { type: 'number' },
            },
        );
    }

    * worker({ i, start, step }) {
        yield {
            val: start + i * step,
        };
    }
}

export default StepComponent;
