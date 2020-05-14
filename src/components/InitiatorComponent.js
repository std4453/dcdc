import { BeanComponent } from '../retex/components';

class InitiatorComponent extends BeanComponent {
    constructor() {
        super(
            'Initiator',
            {},
            {},
        );
    }

    async worker() {}
}

export default InitiatorComponent;
