export interface InputFormState {
    startPoint: string;
    endPoint: string;
    algorithm: string;
    pathLength: string;
}

export const SET_START_POINT = 'SET_START_POINT';
export const SET_END_POINT = 'SET_END_POINT';
export const SET_ALGORITHM = 'SET_ALGORITHM';
export const SET_PATH_LENGTH = 'SET_PATH_LENGTH';

interface SetStartPointAction {
    type: typeof SET_START_POINT;
    startPoint: string;
}

interface SetEndPointAction {
    type: typeof SET_END_POINT;
    endPoint: string;
}

interface SetAlgorithmAction {
    type: typeof SET_ALGORITHM;
    algorithm: string;
}

interface SetPathLengthAction {
    type: typeof SET_PATH_LENGTH;
    pathLength: string;
}

export type InputFormTypes = SetStartPointAction | SetEndPointAction | SetAlgorithmAction | SetPathLengthAction