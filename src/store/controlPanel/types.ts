export interface ControlPanelState {
    startPoint: string;
    endPoint: string;
    algorithm: string;
}

export const SET_START_POINT = 'SET_START_POINT';
export const SET_END_POINT = 'SET_END_POINT';
export const SET_ALGORITHM = 'SET_ALGORITHM';

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

export type ControlPanelTypes = SetStartPointAction | SetEndPointAction | SetAlgorithmAction