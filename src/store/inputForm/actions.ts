import {InputFormTypes, SET_ALGORITHM, SET_END_POINT, SET_PATH_LENGTH, SET_START_POINT} from "./types";

export function setStartPoint(startPoint: string): InputFormTypes {
    return {
        type: SET_START_POINT,
        startPoint: startPoint
    };
}

export function setEndPoint(endPoint: string): InputFormTypes {
    return {
        type: SET_END_POINT,
        endPoint: endPoint
    };
}

export function setAlgorithm(algorithm: string): InputFormTypes {
    return {
        type: SET_ALGORITHM,
        algorithm: algorithm
    };
}

export function setPathLength(pathLength: string): InputFormTypes {
    return {
        type: SET_PATH_LENGTH,
        pathLength: pathLength
    };
}