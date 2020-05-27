// lifecycle
import InitiatorComponent from './InitiatorComponent';
import ioComponents from './IOComponents';

// rendering
import CanvasComponent from './CanvasComponent';
import FontComponent from './FontComponent';
import CharComponent from './CharComponent';

// calculation
import UniformComponent from './UniformComponent';
import StepComponent from './StepComponent';
import commonComponents from './ArithmeticComponent';

// generation
import SplitComponent from './SplitComponent';
import BalancedAComponent from './BalancedAComponent';
import BalancedBComponent from './BalancedBComponent';
import NeutralComponent from './NeutralComponent';
import ActiveAComponent from './ActiveAComponent';
import ActiveBComponent from './ActiveBComponent';

export default [
    CanvasComponent, 
    FontComponent, 
    UniformComponent, 
    CharComponent,
    InitiatorComponent,
    StepComponent,
    BalancedAComponent,
    SplitComponent,
    BalancedBComponent,
    NeutralComponent,
    ActiveAComponent,
    ActiveBComponent,
    ...commonComponents,
    ...ioComponents,
];
