import {usersReducer} from "./reducers";
import {UsersTypes} from "./types";

describe("The users reducer", () => {
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

    it("correctly handle users login request", () => {
        const action: UsersTypes = {
            type: 'USERS_LOGIN_REQUEST',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: true,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users login success", () => {
        const action: UsersTypes = {
            type: 'USERS_LOGIN_SUCCESS',
            user: {username: 'username', token: 'token'},
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: true,
            registering: false,
            points: defaultPoints,
            user: {username: 'username', token: 'token'}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users login failure", () => {
        const action: UsersTypes = {
            type: 'USERS_LOGIN_FAILURE',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users logout", () => {
        const action: UsersTypes = {
            type: 'USERS_LOGOUT',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users registration request", () => {
        const action: UsersTypes = {
            type: 'USERS_REGISTRATION_REQUEST',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: true,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users registration success", () => {
        const action: UsersTypes = {
            type: 'USERS_REGISTRATION_SUCCESS',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users registration failure", () => {
        const action: UsersTypes = {
            type: 'USERS_REGISTRATION_FAILURE',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users start adding new point", () => {
        const action: UsersTypes = {
            type: 'USERS_ADDNEWPOINT_START',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: true,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users end adding new point", () => {
        const action: UsersTypes = {
            type: 'USERS_ADDNEWPOINT_END',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users add new point request", () => {
        const action: UsersTypes = {
            type: 'USERS_ADDNEWPOINT_REQUEST',
        };
        const expectedState = {
            addingNewPoint: true,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users add new point success", () => {
        const action: UsersTypes = {
            type: 'USERS_ADDNEWPOINT_SUCCESS',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users add new point failure", () => {
        const action: UsersTypes = {
            type: 'USERS_ADDNEWPOINT_FAILURE',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users get points success", () => {
        const action: UsersTypes = {
            type: 'USERS_GETPOINTS_SUCCESS',
            points: [{nodeId: '1', name: 'point1'}, {nodeId: '2', name: 'point2'}],
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: [{nodeId: '1', name: 'point1'}, {nodeId: '2', name: 'point2'}],
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });

    it("correctly handle users get points failure", () => {
        const action: UsersTypes = {
            type: 'USERS_GETPOINTS_FAILURE',
        };
        const expectedState = {
            addingNewPoint: false,
            selectingPointOnMap: false,
            loggingIn: false,
            loggedIn: false,
            registering: false,
            points: defaultPoints,
            user: {username: '', token: ''}
        };

        expect(usersReducer(undefined, action)).toEqual(expectedState);
    });
});