import update from 'immutability-helper';

import {
    ControlPanelState,
    ControlPanelTypes,
    SET_ALGORITHM,
    SET_END_POINT,
    SET_PATH_LENGTH,
    SET_START_POINT
} from "./types";

const initialState: ControlPanelState = {
    startPoint: '1788932701',
    endPoint: '1788932701',
    algorithm: 'aGreedy',
    pathLength: '',
};

export function controlPanelReducer(
    state = initialState,
    action: ControlPanelTypes
): ControlPanelState {
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
        case SET_PATH_LENGTH:
            return update(state, {
                pathLength: { $set: action.pathLength }
            });
        default:
            return state;
    }
}