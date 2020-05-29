import { BeanComponent } from './BeanComponent';

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
