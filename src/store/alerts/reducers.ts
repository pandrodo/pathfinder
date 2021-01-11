import update from 'immutability-helper';

import {ALERT_CLEAR, ALERT_ERROR, ALERT_SUCCESS, ALERT_WARNING, AlertState, AlertTypes} from "./types";

const initialState: AlertState = {
    style: '',
    message: '',
    source: ''
};

export function alertReducer(
    state = initialState,
    action: AlertTypes
): AlertState {
    switch (action.type) {
        case ALERT_SUCCESS:
            return update(state, {
                style: { $set: 'success' },
                message: { $set: action.message },
                source: { $set: action.source }
            });
        case ALERT_WARNING:
            return update(state, {
                style: { $set: 'warning' },
                message: { $set: action.message },
                source: { $set: action.source }
            });
        case ALERT_ERROR:
            return update(state, {
                style: { $set: 'danger' },
                message: { $set: action.message },
                source: { $set: action.source }
            });
        case ALERT_CLEAR:
            return update(state, {
                style: { $set: '' },
                message: { $set: '' },
                source: { $set: '' }
            });
        default:
            return state;
    }
}