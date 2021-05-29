import SongSelection from './SongSelection';
import EditLyrics from './EditLyrics';
import Moodboard from './Moodboard';
import { FetchData, FetchFont } from './Loading';
import Segmentation from './Segmentation';
import { InitialValues } from './Rules';
import Generation from './Generation';

const steps = {
    SongSelection, FetchData, EditLyrics, FetchFont, Moodboard, Segmentation,
    InitialValues, Generation, 
};

const nextSteps = {
    SongSelection: 'FetchData',
    FetchData: 'EditLyrics',
    EditLyrics: 'Moodboard',
    Moodboard: 'FetchFont',
    FetchFont: 'Segmentation',
    Segmentation: 'InitialValues',
    InitialValues: 'Generation',
};

const prevSteps = {
    Moodboard: 'EditLyrics',
    Segmentation: 'Moodboard',
    InitialValues: 'Segmentation',
    Generation: 'InitialValues',
};

const initialStep = 'SongSelection';

export { steps, nextSteps, initialStep, prevSteps };
