export interface AlertState {
    message: string;
    style: string;
    source: string;
}

export const ALERT_SUCCESS = 'ALERT_SUCCESS';
export const ALERT_WARNING = 'ALERT_WARNING';
export const ALERT_ERROR = 'ALERT_ERROR';
export const ALERT_CLEAR = 'ALERT_CLEAR';

interface AlertSuccess {
    type: typeof ALERT_SUCCESS;
    message: string;
    source: string;
}

interface AlertWarning {
    type: typeof  ALERT_WARNING;
    message: string;
    source: string;
}

interface AlertError {
    type: typeof ALERT_ERROR;
    message: string;
    source: string;
}

interface AlertClear {
    type: typeof ALERT_CLEAR;
}

export type AlertTypes = AlertSuccess | AlertWarning | AlertError | AlertClear;