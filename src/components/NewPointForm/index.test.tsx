import React from 'react';
import {rest} from "msw";
import {setupServer} from "msw/node";
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import {Provider} from "react-redux";
import '@testing-library/jest-dom/extend-expect'

import configureStore from "../../store";

import NewPointForm from "./index";
import * as userActions from "../../store/users/actions";
import {addNewPointFailure, addNewPointRequest, loginSuccess} from "../../store/users/actions";

describe("The NewPointForm", () => {
    const API = 'http://192.168.1.39:3000';

    const server = setupServer(
        rest.post(`${API}/getUserPoints`,(req, res, ctx) => {
            return res(ctx.status(200));
        }),
    );
    beforeAll(() => server.listen());
    beforeEach(() => jest.restoreAllMocks());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("shows Add New Point button", () => {
        const store = configureStore();
        store.dispatch(loginSuccess({username: 'username', token: 'token'}));

        render(
            <Provider store={store}>
                <NewPointForm/>
            </Provider>
        );

        const addNewPointButton = screen.getByRole('button', {name: 'Новая точка'});
        expect(addNewPointButton).toBeInTheDocument();
    });

    it("Add New Point button changes value on click", () => {
        const store = configureStore();
        store.dispatch(loginSuccess({username: 'username', token: 'token'}));

        render(
            <Provider store={store}>
                <NewPointForm/>
            </Provider>
        );

        const addNewPointButton = screen.getByRole('button', {name: 'Новая точка'});

        userEvent.click(addNewPointButton);
        expect(addNewPointButton).toHaveValue('Назад');

        userEvent.click(addNewPointButton);
        expect(addNewPointButton).toHaveValue('Новая точка');
    });

    it("dispatches get points action on mounting", () => {
        const store = configureStore();
        store.dispatch(loginSuccess({username: 'username', token: 'token'}));

        const getPointsSpy = jest.spyOn(userActions, "getPoints");

        render(
            <Provider store={store}>
                <NewPointForm/>
            </Provider>
        );

        expect(getPointsSpy).toHaveBeenCalledTimes(1);
    });

    it("dispatches get points action after adding new point", async () => {
        const store = configureStore();
        store.dispatch(loginSuccess({username: 'username', token: 'token'}));

        render(
            <Provider store={store}>
                <NewPointForm/>
            </Provider>
        );

        const getPointsSpy = jest.spyOn(userActions, "getPoints");

        store.dispatch(addNewPointRequest());
        store.dispatch(addNewPointFailure());

        await waitFor(() =>
            expect(getPointsSpy).toHaveBeenCalledTimes(1)
        );
    });

    it("Logout Button dispatches logout action on click", () => {
        const store = configureStore();
        store.dispatch(loginSuccess({username: 'username', token: 'token'}));

        render(
            <Provider store={store}>
                <NewPointForm/>
            </Provider>
        );

        const logoutButton = screen.getByRole('button', {name: 'Выйти'});
        const logoutSpy = jest.spyOn(userActions, "logout");
        userEvent.click(logoutButton);

        expect(logoutSpy).toHaveBeenCalledTimes(1);
    });
});