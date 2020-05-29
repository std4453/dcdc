import SongSelection from './SongSelection';
import Loading from './Loading';
import Moodboard from './Moodboard';
import Segmentation from './Segmentation';
import { InitialValues, GenerationRules } from './Rules';
import Generation from './Generation';

const steps = {
    SongSelection, Loading, Moodboard, Segmentation,
    InitialValues, GenerationRules, Generation,
};

const initialStep = 'SongSelection';

export { steps, initialStep };
