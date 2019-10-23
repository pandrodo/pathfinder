import {ControlPanelTypes, SET_ALGORITHM, SET_END_POINT, SET_START_POINT} from "./types";

export function setStartPoint(startPoint: string): ControlPanelTypes {
    return {
        type: SET_START_POINT,
        startPoint: startPoint
    };
}

export function setEndPoint(endPoint: string): ControlPanelTypes {
    return {
        type: SET_END_POINT,
        endPoint: endPoint
    };
}

export function setAlgorithm(algorithm: string): ControlPanelTypes {
    return {
        type: SET_ALGORITHM,
        algorithm: algorithm
    };
}