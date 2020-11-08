import {Dispatch} from "redux";

import {
    Point,
    User,
    USERS_LOGIN_REQUEST,
    USERS_LOGIN_SUCCESS,
    USERS_LOGIN_FAILURE,
    USERS_LOGOUT,
    USERS_REGISTRATION_REQUEST,
    USERS_REGISTRATION_SUCCESS,
    USERS_REGISTRATION_FAILURE,
    USERS_ADDNEWPOINT_START,
    USERS_ADDNEWPOINT_END,
    USERS_ADDNEWPOINT_REQUEST,
    USERS_ADDNEWPOINT_SUCCESS,
    USERS_ADDNEWPOINT_FAILURE,
    USERS_GETPOINTS_SUCCESS,
    USERS_GETPOINTS_FAILURE,
    UsersTypes
} from "./types";
import {addNewUserPoint, getUserPoints, loginUser, logoutUser, registrationUser} from "../../services/users";
import {alertClear, alertError, alertSuccess} from "../alerts/actions";
import {DispatchFunctionType} from "../index";

export function loginRequest(): UsersTypes {
    return {
        type: USERS_LOGIN_REQUEST,
    }
}

export function loginSuccess(user: User): UsersTypes {
    return {
        type: USERS_LOGIN_SUCCESS,
        user: user
    }
}

export function loginFailure(): UsersTypes {
    return {
        type: USERS_LOGIN_FAILURE
    }
}

export const login = (username: string, password: string) => async (dispatch: DispatchFunctionType) => {
    dispatch(loginRequest());

    await loginUser(username, password)
        .then(
            response => {
                dispatch(loginSuccess(response.user));
                dispatch(alertSuccess(response.message));
                },
            error => {
                dispatch(loginFailure());
                dispatch(alertError(error.toString()));
                }
        );
};

export function logoutAction() {
    return {
        type: USERS_LOGOUT
    }
}

export const logout = () => (dispatch: Dispatch) => {
    logoutUser();
    dispatch(logoutAction());
    dispatch(alertClear());
};

export function registrationRequest(): UsersTypes {
    return {
        type: USERS_REGISTRATION_REQUEST
    }
}

export function registrationSuccess(): UsersTypes {
    return {
        type: USERS_REGISTRATION_SUCCESS
    }
}

export function registrationFailure(): UsersTypes {
    return {
        type: USERS_REGISTRATION_FAILURE
    }
}

export const registration = (username: string, password: string) => async (dispatch: DispatchFunctionType) => {
    dispatch(registrationRequest());

    await registrationUser(username, password)
        .then(
            response => {
                dispatch(registrationSuccess());
                dispatch(alertSuccess(response.message));
            },
            error => {
                dispatch(registrationFailure());
                dispatch(alertError(error.toString()));
            }
        );
}

export function addNewPointStart(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_START
    }
}

export function addNewPointEnd(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_END
    }
}

export function addNewPointRequest(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_REQUEST
    }
}

export function addNewPointSuccess(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_SUCCESS
    }
}

export function addNewPointFailure(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_FAILURE
    }
}

export const addNewPoint = (username: string, nodeId: string, name: string) => async (dispatch: DispatchFunctionType) => {
    dispatch(addNewPointRequest());

    await addNewUserPoint(username, nodeId, name)
        .then(
            response => {
                dispatch(addNewPointSuccess());
                dispatch(alertSuccess(response.message));
            },
            error => {
                dispatch(addNewPointFailure());
                dispatch(alertError(error.toString()));
            }
        );
}

export function getPointsSuccess(points: Point[]): UsersTypes {
    return {
        type: USERS_GETPOINTS_SUCCESS,
        points: points
    }
}

function getPointsFailure(): UsersTypes {
    return {
        type: USERS_GETPOINTS_FAILURE
    }
}

export const getPoints = (username: string) => async (dispatch: DispatchFunctionType) => {
    await getUserPoints(username)
        .then(
            points => dispatch(getPointsSuccess(points)),
            error => {
                dispatch(getPointsFailure());
                dispatch(alertError(error.toString()));
            }
        );
}