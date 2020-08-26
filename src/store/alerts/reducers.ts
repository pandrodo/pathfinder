import update from 'immutability-helper';

import {ALERT_CLEAR, ALERT_ERROR, ALERT_SUCCESS, ALERT_WARNING, AlertState, AlertTypes} from "./types";

const initialState: AlertState = {
    style: '',
    message: '',
};

export function alertReducer(
    state = initialState,
    action: AlertTypes
): AlertState {
    switch (action.type) {
        case ALERT_SUCCESS:
            return update(state, {
                style: { $set: 'alert-success' },
                message: { $set: action.message }
            });
        case ALERT_WARNING:
            return update(state, {
                style: { $set: 'alert-warning' },
                message: { $set: action.message }
            });
        case ALERT_ERROR:
            return update(state, {
                style: { $set: 'alert-danger' },
                message: { $set: action.message }
            });
        case ALERT_CLEAR:
            return update(state, {
                style: { $set: '' },
                message: { $set: '' }
            });
        default:
            return state;
    }
}