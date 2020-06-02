import SongSelection from './SongSelection';
import Moodboard from './Moodboard';
import { FetchData, FetchFont } from './Loading';
import Segmentation from './Segmentation';
import { InitialValues } from './Rules';
import Generation from './Generation';

const steps = {
    SongSelection, FetchData, FetchFont, Moodboard, Segmentation,
    InitialValues, Generation, 
};

const nextSteps = {
    SongSelection: 'FetchData',
    FetchData: 'Moodboard',
    Moodboard: 'Segmentation',
    FetchFont: 'Segmentation',
    Segmentation: 'InitialValues',
    InitialValues: 'Generation',
};

const prevSteps = {
    Segmentation: 'Moodboard',
    InitialValues: 'Segmentation',
    Generation: 'InitialValues',
};

const initialStep = 'SongSelection';

export { steps, nextSteps, initialStep, prevSteps };
