import {
    Point,
    User,
    USERS_ADDNEWPOINT_END,
    USERS_ADDNEWPOINT_START,
    USERS_GETPOINTS_FAILURE,
    USERS_GETPOINTS_SUCCESS,
    USERS_LOGIN_FAILURE,
    USERS_LOGIN_REQUEST,
    USERS_LOGIN_SUCCESS,
    USERS_LOGOUT,
    UsersTypes
} from "./types";
import {getUserPoints, loginUser, logoutUser, registrationUser, addNewUserPoint} from "../../services/users";
import {ThunkAction} from "redux-thunk";
import {alertClear, alertError, alertSuccess} from "../alerts/actions";

export function login(username: string, password: string): ThunkAction<any, any, any, any>  {
    return (dispatch) => {
        dispatch(request({ username: username, token: '' }));

        loginUser(username, password)
            .then(
                user => {
                    dispatch(alertSuccess(`Hello, ${username}`));
                    dispatch(success(user));
                },
                error => {
                    dispatch(alertError(`Login error: ${error}`));
                    dispatch(failure(error));
                }
            );
    };

    function request(user: User): UsersTypes {
        return {
            type: USERS_LOGIN_REQUEST,
            user: user
        }
    }

    function success(user: User): UsersTypes {
        return {
            type: USERS_LOGIN_SUCCESS,
            user: user
        }
    }

    function failure(error: string): UsersTypes {
        return {
            type: USERS_LOGIN_FAILURE,
            error: error
        }
    }
}

export function logout(): ThunkAction<any, any, any, any> {
    return (dispatch) => {
        logoutUser();
        dispatch(alertClear());
        dispatch(logout_action());
    };

    function logout_action(): UsersTypes {
        return {
            type: USERS_LOGOUT
        }
    }
}

export function addNewPointStart(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_START,
    };
}

export function addNewPointEnd(): UsersTypes {
    return {
        type: USERS_ADDNEWPOINT_END
    };
}

export function addNewPoint(username: string, nodeId: string, name: string): ThunkAction<any, any, any, any> {
    return (dispatch) => {
        addNewUserPoint(username, nodeId, name)
            .then(
                message => {
                    dispatch(alertSuccess(message));
                    dispatch(getPoints(username));
                },
                error => dispatch(alertError(error))
            );
    };
}

export function getPoints(username: string): ThunkAction<any, any, any, any> {
    return (dispatch) => {
        getUserPoints(username)
            .then(
                points => dispatch(success(points)),
                error => dispatch(failure(error))
            );
    };

    function success(points: Point[]): UsersTypes {
        return {
            type: USERS_GETPOINTS_SUCCESS,
            points: points
        }
    }

    function failure(error: string): UsersTypes {
        return {
            type: USERS_GETPOINTS_FAILURE,
            error: error
        }
    }
}

export function registration(username: string, password: string): ThunkAction<any, any, any, any> {
    return (dispatch) => {
        registrationUser(username, password)
            .then(
                message => dispatch(alertSuccess(message)),
                error => dispatch(alertError(error))
            );

    };
}