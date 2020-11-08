import React from 'react';
import {rest} from "msw";
import {setupServer} from "msw/node";
import {render, screen} from '@testing-library/react';
import {Provider} from "react-redux";
import '@testing-library/jest-dom/extend-expect';

import configureStore from "../../store";
import {alertError} from "../../store/alerts/actions";

import App from "./index";

describe("The App component", () => {
    const server = setupServer(
        rest.post('/getUserPoints',(req, res, ctx) => {
            return res(ctx.status(200));
        }),
    );

    beforeEach(() => localStorage.clear());
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("shows login form if no user data stored", () => {
       const store = configureStore();

       render(
           <Provider store={store}>
               <App/>
           </Provider>
       );

       const loginFormNode = screen.getByRole('form', {name: 'Login Form'});
       expect(loginFormNode).toBeInTheDocument();
    });

    it("shows new point form if user data stored", () => {
        const storedUser = JSON.stringify({username: 'user', token: 'token'});
        localStorage.setItem('user', storedUser);

        const store = configureStore();

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );

        const newPointFormNode = screen.getByRole('form', {name: 'New Point Form'});
        expect(newPointFormNode).toBeInTheDocument();
    });

    it("shows alert if alert message stored", () => {
        const store = configureStore();
        store.dispatch(alertError('Error'));

        render(
            <Provider store={store}>
                <App/>
            </Provider>
        );

        const alertNode = screen.getByRole('alert', {name: 'Error'});
        expect(alertNode).toBeInTheDocument();
    });
});