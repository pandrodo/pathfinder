import {ALERT_CLEAR, ALERT_ERROR, ALERT_SUCCESS, ALERT_WARNING, AlertTypes} from "./types";

export function alertSuccess(message: string, source: string): AlertTypes {
    return {
        type: ALERT_SUCCESS,
        message: message,
        source: source
    };
}

export function alertWarning(message: string, source: string): AlertTypes {
    return {
        type: ALERT_WARNING,
        message: message,
        source: source
    };
}

export function alertError(message: string, source: string): AlertTypes {
    return {
        type: ALERT_ERROR,
        message: message,
        source: source
    };
}

export function alertClear(): AlertTypes {
    return {
        type: ALERT_CLEAR
    };
}