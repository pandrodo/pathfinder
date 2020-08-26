import update from 'immutability-helper';

import {
    USERS_ADDNEWPOINT_END,
    USERS_ADDNEWPOINT_START,
    USERS_GETPOINTS_FAILURE,
    USERS_GETPOINTS_SUCCESS,
    USERS_LOGIN_FAILURE,
    USERS_LOGIN_REQUEST,
    USERS_LOGIN_SUCCESS,
    USERS_LOGOUT,
    UserPanelState,
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

let initialState: UserPanelState = {
    addingNewPoint: false,
    loggingIn: false,
    loggedIn: false,
    user: { username: '', token: '', points: defaultPoints }
};

const storedUser = localStorage.getItem('user');
if (storedUser) {
    const user = JSON.parse(storedUser);
    initialState = {
        addingNewPoint: false,
        loggingIn: false,
        loggedIn: true,
        user: user
    };
}

export function usersReducer(
    state = initialState,
    action: UsersTypes
): UserPanelState {
    switch (action.type) {
        case USERS_LOGIN_REQUEST:
            return update(state, {
                loggingIn: { $set: true },
                user: { $set: action.user }
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
                user: { $set: { username: '', token: '', points: defaultPoints} }
            });
        case USERS_LOGOUT:
            return update(state, {
                loggingIn: { $set: false},
                loggedIn: { $set: false},
                user: { $set: { username: '', token: '', points: defaultPoints}}
            });
        case USERS_ADDNEWPOINT_START:
            return update(state, {
                addingNewPoint: { $set: true},
            });
        case USERS_ADDNEWPOINT_END:
            return update(state, {
                addingNewPoint: { $set: false },
            });
        case USERS_GETPOINTS_SUCCESS:
            return update(state, {
                user: { points: { $set: action.points } }
            });
        case USERS_GETPOINTS_FAILURE:
            return update(state, {
                user: { points: { $set: defaultPoints } }
            });
        default:
            return state;
    }
}
