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
                task.component.editor.once('postprocess', () => task.run());
            }
        );
    }

    async exec() {}
}

export default InitiatorComponent;
