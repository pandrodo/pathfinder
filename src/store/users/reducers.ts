import update from 'immutability-helper';

import {
    UserPanelState,
    USERS_ADDNEWPOINT_END,
    USERS_ADDNEWPOINT_FAILURE,
    USERS_ADDNEWPOINT_REQUEST,
    USERS_ADDNEWPOINT_START,
    USERS_ADDNEWPOINT_SUCCESS,
    USERS_GETPOINTS_FAILURE,
    USERS_GETPOINTS_SUCCESS,
    USERS_LOGIN_FAILURE,
    USERS_LOGIN_REQUEST,
    USERS_LOGIN_SUCCESS,
    USERS_LOGOUT,
    USERS_REGISTRATION_FAILURE,
    USERS_REGISTRATION_REQUEST,
    USERS_REGISTRATION_SUCCESS,
    SET_ACTIVE_PANEL,
    SET_THEME,
    UsersTypes
} from "./types";

const defaultPoints = [
    {nodeId: '2572156610', name: 'Drama theatre'},
    {nodeId: '5269608776', name: 'Circus'},
    {nodeId: '3708439426', name: 'Vasnetsov art museum'},
    {nodeId: '1345594583', name: 'Alexander garden'},
    {nodeId: '1350861918', name: 'Philharmonie'},
];

const initialState: UserPanelState = {
    activePanel: 'none',
    addingNewPoint: false,
    selectingPointOnMap: false,
    loggingIn: false,
    loggedIn: false,
    registering: false,
    points: defaultPoints,
    user: { username: '', token: '' },
    theme: 'light'
};

export function usersReducer(
    state = initialState,
    action: UsersTypes
): UserPanelState {
    switch (action.type) {
        case USERS_LOGIN_REQUEST:
            return update(state, {
                loggingIn: { $set: true },
            });
        case USERS_LOGIN_SUCCESS:
            return update(state, {
                activePanel: { $set: 'none' },
                loggingIn: { $set: false },
                loggedIn: { $set: true },
                user: { $set: action.user }
            });
        case USERS_LOGIN_FAILURE:
            return update(state, {
                loggingIn: { $set: false },
                loggedIn: { $set: false },
                user: { $set: { username: '', token: '' } }
            });
        case USERS_LOGOUT:
            return update(state, {
                activePanel: { $set: 'none' },
                loggingIn: { $set: false},
                loggedIn: { $set: false},
                points: { $set: defaultPoints },
                user: { $set: { username: '', token: ''} }
            });
        case USERS_REGISTRATION_REQUEST:
            return update(state, {
                registering: { $set: true },
            });
        case USERS_REGISTRATION_SUCCESS:
            return update(state, {
                activePanel: { $set: 'none' },
                registering: { $set: false },
            });
        case USERS_REGISTRATION_FAILURE:
            return update(state, {
                registering: { $set: false },
            });
        case USERS_ADDNEWPOINT_START:
            return update(state, {
                selectingPointOnMap: { $set: true },
            });
        case USERS_ADDNEWPOINT_END:
            return update(state, {
                selectingPointOnMap: { $set: false },
            });
        case USERS_ADDNEWPOINT_REQUEST:
            return update(state, {
                addingNewPoint: { $set: true},
            });
        case USERS_ADDNEWPOINT_SUCCESS:
            return update(state, {
                addingNewPoint: { $set: false },
            });
        case USERS_ADDNEWPOINT_FAILURE:
            return update(state, {
                addingNewPoint: { $set: false },
            });
        case USERS_GETPOINTS_SUCCESS:
            return update(state, {
                points: { $set: action.points },
            });
        case USERS_GETPOINTS_FAILURE:
            return update(state, {
                points: { $set: defaultPoints },
            });
        case SET_ACTIVE_PANEL:
            return update(state, {
                activePanel: { $set: action.panel },
            });
        case SET_THEME:
            return update(state, {
                theme: { $set: action.theme },
            });
        default:
            return state;
    }
}
