import {InputFormTypes, SET_ALGORITHM, SET_END_POINT, SET_START_POINT} from "./types";
import {Point} from "../users/types";

export function setStartPoint(startPoint: Point): InputFormTypes {
    return {
        type: SET_START_POINT,
        startPoint: startPoint
    };
}

export function setEndPoint(endPoint: Point): InputFormTypes {
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