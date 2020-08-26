import {ALERT_CLEAR, ALERT_ERROR, ALERT_SUCCESS, ALERT_WARNING, AlertTypes} from "./types";

export function alertSuccess(message: string): AlertTypes {
    return {
        type: ALERT_SUCCESS,
        message: message
    };
}

export function alertWarning(message: string): AlertTypes {
    return {
        type: ALERT_WARNING,
        message: message
    };
}

export function alertError(message: string): AlertTypes {
    return {
        type: ALERT_ERROR,
        message: message
    };
}

export function alertClear(): AlertTypes {
    return {
        type: ALERT_CLEAR
    };
}