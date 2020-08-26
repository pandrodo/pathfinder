export interface Point {
    nodeId: string,
    name: string
}

export interface User {
    username: string,
    token: string,
    points: Point[]
}

export interface UserPanelState {
    addingNewPoint: boolean,
    loggingIn: boolean,
    loggedIn: boolean,
    user: User
}

export const USERS_LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
export const USERS_LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
export const USERS_LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';

export const USERS_LOGOUT = 'USERS_LOGOUT';

export const USERS_GETPOINTS_SUCCESS = 'USERS_GETPOINTS_SUCCESS';
export const USERS_GETPOINTS_FAILURE = 'USERS_GETPOINTS_FAILURE';

export const USERS_ADDNEWPOINT_START = 'USERS_ADDNEWPOINT_START';
export const USERS_ADDNEWPOINT_END = 'USERS_ADDNEWPOINT_END';

interface UsersLoginRequest {
    type: typeof USERS_LOGIN_REQUEST;
    user: User
}

interface UsersLoginSuccess {
    type: typeof USERS_LOGIN_SUCCESS;
    user: User;
}

interface UsersLoginFailure {
    type: typeof  USERS_LOGIN_FAILURE;
    error: string;
}

interface UsersLogout {
    type: typeof USERS_LOGOUT;
}

interface UsersAddNewPointStart {
    type: typeof USERS_ADDNEWPOINT_START;
}

interface UsersAddNewPointEnd {
    type: typeof USERS_ADDNEWPOINT_END;
}

interface UsersGetpointsSuccess {
    type: typeof USERS_GETPOINTS_SUCCESS;
    points: Point[];
}

interface UsersGetpointsFailure {
    type: typeof USERS_GETPOINTS_FAILURE;
    error: string;
}

export type UsersTypes = UsersLoginRequest | UsersLoginSuccess | UsersLoginFailure | UsersLogout | UsersGetpointsSuccess | UsersGetpointsFailure | UsersAddNewPointStart | UsersAddNewPointEnd;