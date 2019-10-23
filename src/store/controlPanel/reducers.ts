import update from 'immutability-helper';

import {ControlPanelState, ControlPanelTypes, SET_ALGORITHM, SET_END_POINT, SET_START_POINT} from "./types";

const initialState: ControlPanelState = {
    startPoint: '1788932701',
    endPoint: '1788932701',
    algorithm: 'aGreedy',
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
        default:
            return state;
    }
}