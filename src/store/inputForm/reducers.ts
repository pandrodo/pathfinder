import update from 'immutability-helper';

import {
    InputFormState,
    InputFormTypes,
    SET_ALGORITHM,
    SET_END_POINT,
    SET_START_POINT
} from "./types";

const initialState: InputFormState = {
    startPoint: {name: '', nodeId: ''},
    endPoint: {name: '', nodeId: ''},
    algorithm: '',
};

export function inputFormReducer(
    state = initialState,
    action: InputFormTypes
): InputFormState {
    switch (action.type) {
        case SET_START_POINT:
            return update(state, {
                startPoint: { $set: action.startPoint }
            });
        case SET_END_POINT:
            return update(state, {
                endPoint: { $set: action.endPoint }
            });
        case SET_ALGORITHM:
            return update(state, {
                algorithm: { $set: action.algorithm }
            });
        default:
            return state;
    }
}