import update from 'immutability-helper';

import {MapState, MapTypes, SET_AVAILABLE_PATHFINDERS} from "./types";

const initialState: MapState = {
    availablePathfinders: []
}

export function mapReducer(
    state = initialState,
    action: MapTypes
): MapState {
    switch (action.type) {
        case SET_AVAILABLE_PATHFINDERS:
            return update(state, {
                availablePathfinders: { $set: action.availablePathfinders }
            });
        default:
            return state;
    }
}