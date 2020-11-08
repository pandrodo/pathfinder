import {rest} from "msw";
import {setupServer} from "msw/node";
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {addNewPoint, getPoints, login, logout, registration,} from "./actions"

import {AppState, DispatchFunctionType} from "../index";

describe("The users action", () => {
    interface UserCredentials {
        username: string,
        password: string
    }

    interface NewPoint {
        username: string,
        nodeId: string,
        name: string
    }

    const API = 'http://192.168.1.39:3000';

    const server = setupServer(
        rest.post(`${API}/loginUser`,(req, res, ctx) => {
            if (req && req.body) {
                const {username, password} = req.body as UserCredentials;

                if (username === 'username' && password === 'password') {
                    return res(
                        ctx.json({
                            auth: true,
                            user: {
                                username: username,
                                token: 'token',
                            },
                            message: `Hello, ${username}`,
                        })
                    );
                }
                if (username === 'handleResponse') {
                    return res(
                        ctx.status(404, 'Not Found'),
                    )
                }
            }
            return res(
                ctx.status(401),
                ctx.json({
                    message: 'Error',
                })
            );
        }),
        rest.post(`${API}/registerUser`, (req, res, ctx) => {
            if (req && req.body) {
                const {username, password} = req.body as UserCredentials;

                if (username === 'username' && password === 'password') {
                    return res(
                        ctx.json({
                            message: 'User created',
                        })
                    );
                }
            }
            return res (
                ctx.status(409),
                ctx.json({
                    message: 'Username already taken',
                })
            );
        }),
        rest.post(`${API}/addUserPoint`, (req, res, ctx) => {
            if (req && req.body && req.headers) {
                const {username, nodeId, name} = req.body as NewPoint;
                const authorizationToken = req.headers.get('x-access-token');

                if (username === 'username' && nodeId === '12345' && name === 'point' && authorizationToken === 'token') {
                    return res(
                        ctx.status(200),
                        ctx.json({message: `Point ${name + nodeId} added for user ${username}`})
                    );
                }
            }
            return res(
                ctx.status(401),
                ctx.json({message: 'Error'})
            );
        }),
        rest.post(`${API}/getUserPoints`, (req, res, ctx) => {
            if (req && req.body) {
                const {username} = req.body as {username: string};

                if (username === 'username') {
                    return res(
                        ctx.status(200),
                        ctx.json([{nodeId: '12345', name: 'point'}])
                    )
                }
            }
            return res(
                ctx.status(401),
                ctx.json({message: 'Error'})
            );
        }),
    );

    const mockStore = configureStore<AppState, DispatchFunctionType>([thunk]);
    const store = mockStore();

    beforeAll(() => server.listen());
    beforeEach(() => {
        store.clearActions();
        localStorage.clear();
    });
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("correctly handles response without error message", async () => {
        await store.dispatch(login('handleResponse', ''));

        const expectedActions = [
            {type: 'USERS_LOGIN_REQUEST'},
            {type: 'USERS_LOGIN_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Not Found'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("login dispatches correct actions when correct data sent", async () => {
        await store.dispatch(login('username', 'password'));

        const expectedActions = [
            {type: 'USERS_LOGIN_REQUEST'},
            {type: 'USERS_LOGIN_SUCCESS', user: {username: 'username', token: 'token'}},
            {type: 'ALERT_SUCCESS', message: 'Hello, username'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("login dispatches correct actions when incorrect data sent", async () => {
        await store.dispatch(login('wrong username', 'password'));

        const expectedActions = [
            {type: 'USERS_LOGIN_REQUEST'},
            {type: 'USERS_LOGIN_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Error'},
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("logout dispatches correct actions", async () => {
        await store.dispatch(logout());

        const expectedActions = [
            {type: 'USERS_LOGOUT'},
            {type: 'ALERT_CLEAR'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("registration dispatches correct actions when correct data sent", async () => {
        await store.dispatch(registration('username', 'password'));

        const expectedActions = [
            {type: 'USERS_REGISTRATION_REQUEST'},
            {type: 'USERS_REGISTRATION_SUCCESS'},
            {type: 'ALERT_SUCCESS', message: 'User created'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("registration dispatches correct actions when incorrect data sent", async () => {
        await store.dispatch(registration('wrong username', 'password'));

        const expectedActions = [
            {type: 'USERS_REGISTRATION_REQUEST'},
            {type: 'USERS_REGISTRATION_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Username already taken'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("addNewPoint dispatches correct actions when correct data sent with authorization header", async () => {
        const storedUser = JSON.stringify({username: 'username', token: 'token'});
        localStorage.setItem('user', storedUser);

        await store.dispatch(addNewPoint('username', '12345', 'point'));

        const expectedActions = [
            {type: 'USERS_ADDNEWPOINT_REQUEST'},
            {type: 'USERS_ADDNEWPOINT_SUCCESS'},
            {type: 'ALERT_SUCCESS', message: 'Point point12345 added for user username'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("addNewPoint dispatches correct action when correct data sent with wrong authorization header", async () => {
        const storedUser = JSON.stringify({username: 'username', token: 'wrong token'});
        localStorage.setItem('user', storedUser);
        await store.dispatch(addNewPoint('username', '12345', 'point'));

        const expectedActions = [
            {type: 'USERS_ADDNEWPOINT_REQUEST'},
            {type: 'USERS_ADDNEWPOINT_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Error'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.getItem('user')).toEqual(null);
    });

    it("addNewPoint dispatches correct actions when incorrect data sent", async () => {
        await store.dispatch(addNewPoint('wrong username', '12345', 'point'));

        const expectedActions = [
            {type: 'USERS_ADDNEWPOINT_REQUEST'},
            {type: 'USERS_ADDNEWPOINT_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Error'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("getPoints dispatches correct action when correct data sent", async () => {
        await store.dispatch(getPoints('username'));

        const expectedActions = [
            {type: 'USERS_GETPOINTS_SUCCESS', points: [{nodeId: '12345', name: 'point'}]}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });

    it("getPoints dispatches correct action when incorrect data sent", async () => {
        await store.dispatch(getPoints('wrong username'));

        const expectedActions = [
            {type: 'USERS_GETPOINTS_FAILURE'},
            {type: 'ALERT_ERROR', message: 'Error'}
        ];

        expect(store.getActions()).toEqual(expectedActions);
    });
});