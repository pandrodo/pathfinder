import {Point} from "../users/types";

export interface InputFormState {
    startPoint: Point;
    endPoint: Point;
    algorithm: string;
}

export const SET_START_POINT = 'SET_START_POINT';
export const SET_END_POINT = 'SET_END_POINT';
export const SET_ALGORITHM = 'SET_ALGORITHM';

interface SetStartPointAction {
    type: typeof SET_START_POINT;
    startPoint: Point;
}

interface SetEndPointAction {
    type: typeof SET_END_POINT;
    endPoint: Point;
}

interface SetAlgorithmAction {
    type: typeof SET_ALGORITHM;
    algorithm: string;
}

export type InputFormTypes = SetStartPointAction | SetEndPointAction | SetAlgorithmAction;