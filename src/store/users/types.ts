export interface Point {
    nodeId: string,
    name: string
}

export interface User {
    username: string,
    token: string
}

export interface UserPanelState {
    activePanel: string,
    addingNewPoint: boolean,
    selectingPointOnMap: boolean,
    loggingIn: boolean,
    loggedIn: boolean,
    registering: boolean,
    points: Point[],
    user: User,
    theme: string
}

export const USERS_LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
export const USERS_LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
export const USERS_LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';
export const USERS_LOGOUT = 'USERS_LOGOUT';

export const USERS_REGISTRATION_REQUEST = 'USERS_REGISTRATION_REQUEST';
export const USERS_REGISTRATION_SUCCESS = 'USERS_REGISTRATION_SUCCESS';
export const USERS_REGISTRATION_FAILURE = 'USERS_REGISTRATION_FAILURE';

export const USERS_GETPOINTS_SUCCESS = 'USERS_GETPOINTS_SUCCESS';
export const USERS_GETPOINTS_FAILURE = 'USERS_GETPOINTS_FAILURE';

export const USERS_ADDNEWPOINT_START = 'USERS_ADDNEWPOINT_START';
export const USERS_ADDNEWPOINT_END = 'USERS_ADDNEWPOINT_END';
export const USERS_ADDNEWPOINT_REQUEST = 'USERS_ADDNEWPOINT_REQUEST';
export const USERS_ADDNEWPOINT_SUCCESS = 'USERS_ADDNEWPOINT_SUCCESS';
export const USERS_ADDNEWPOINT_FAILURE = 'USERS_ADDNEWPOINT_FAILURE';

export const SET_ACTIVE_PANEL = 'SET_ACTIVE_PANEL';

export const SET_THEME = 'SET_THEME';

interface UsersLoginRequest {
    type: typeof USERS_LOGIN_REQUEST;
}

interface UsersLoginSuccess {
    type: typeof USERS_LOGIN_SUCCESS;
    user: User;
}

interface UsersLoginFailure {
    type: typeof  USERS_LOGIN_FAILURE;
}

interface UsersLogout {
    type: typeof USERS_LOGOUT;
}

interface UsersRegistrationRequest {
    type: typeof USERS_REGISTRATION_REQUEST;
}

interface UsersRegistrationSuccess {
    type: typeof USERS_REGISTRATION_SUCCESS;
}

interface UsersRegistrationFailure {
    type: typeof USERS_REGISTRATION_FAILURE;
}

interface UsersAddNewPointStart {
    type: typeof USERS_ADDNEWPOINT_START;
}

interface UsersAddNewPointEnd {
    type: typeof USERS_ADDNEWPOINT_END;
}

interface UsersAddNewPointRequest {
    type: typeof USERS_ADDNEWPOINT_REQUEST;
}

interface UsersAddNewPointSuccess {
    type: typeof USERS_ADDNEWPOINT_SUCCESS;
}

interface UsersAddNewPointFailure {
    type: typeof USERS_ADDNEWPOINT_FAILURE;
}

interface UsersGetpointsSuccess {
    type: typeof USERS_GETPOINTS_SUCCESS;
    points: Point[];
}

interface UsersGetpointsFailure {
    type: typeof USERS_GETPOINTS_FAILURE;
}

interface SetActivePanel {
    type: typeof SET_ACTIVE_PANEL;
    panel: string;
}

interface SetTheme {
    type: typeof SET_THEME;
    theme: string;
}

export type UsersTypes = UsersLoginRequest | UsersLoginSuccess | UsersLoginFailure | UsersLogout |
    UsersRegistrationRequest | UsersRegistrationSuccess | UsersRegistrationFailure |
    UsersGetpointsSuccess | UsersGetpointsFailure |
    UsersAddNewPointStart | UsersAddNewPointEnd |
    UsersAddNewPointRequest | UsersAddNewPointSuccess | UsersAddNewPointFailure |
    SetActivePanel |
    SetTheme;