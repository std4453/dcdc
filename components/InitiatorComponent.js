import { BeanComponent } from '../retex/components';

class InitiatorComponent extends BeanComponent {
    constructor() {
        super(
            'Initiator',
            {},
            {
                cc: { type: 'continuation' },
            },
            (task) => {
                setTimeout(() => task.run(), 1000);
                // task.reset();
            }
        );
    }

    async exec() {}
}

export default InitiatorComponent;
