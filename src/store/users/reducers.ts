import update from 'immutability-helper';

import {
    UserPanelState,
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

const defaultPoints = [
    { nodeId: '1788932701', name: 'Дерево желаний' },
    { nodeId: '582469522',  name: 'Музей Васнецовых' },
    { nodeId: '135322595',  name: 'Филармония' },
    { nodeId: '2715644743', name: 'Вокзал' },
    { nodeId: '265513434',  name: 'Факел' },
    { nodeId: '277945806',  name: 'Дружба' },
    { nodeId: '1832176667', name: 'Кочуровский парк' },
    { nodeId: '4076342498', name: 'Зональный институт' },
    { nodeId: '1787337924', name: 'Диорама' },
    { nodeId: '265513353',  name: 'Парк Победы' }
];

const initialState: UserPanelState = {
    addingNewPoint: false,
    selectingPointOnMap: false,
    loggingIn: false,
    loggedIn: false,
    registering: false,
    points: defaultPoints,
    user: { username: '', token: '' }
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
        default:
            return state;
    }
}
