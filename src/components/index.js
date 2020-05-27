// lifecycle
import InitiatorComponent from './InitiatorComponent';

import io from './io';
import common from './common';
import render from './render';
import generation from './generation';
import calculation from './calculation';

export default [
    InitiatorComponent,
    ...io,
    ...common,
    ...render,
    ...generation,
    ...calculation,
];
