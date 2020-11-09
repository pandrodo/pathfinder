import React from 'react';
import {rest} from "msw";
import {setupServer} from "msw/node";
import {render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import {Provider} from "react-redux";
import '@testing-library/jest-dom/extend-expect';

import configureStore from "../../store";

import LoginForm from "./index";
import * as alertActions from "../../store/alerts/actions";
import * as userActions from "../../store/users/actions";

describe("The LoginForm", () => {
    const server = setupServer(
        rest.post('/loginUser',(req, res, ctx) => {
            return res(ctx.status(200));
        }),
        rest.post('/registerUser', (req, res, ctx) => {
            return res(ctx.status(200));
        }),
    );

    beforeEach(() => {
        jest.restoreAllMocks();
        const store = configureStore();
        render(
            <Provider store={store}>
                <LoginForm/>
            </Provider>
        );
    });
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("shows username input field and it changes component state on change", () => {
        const usernameInputNode = screen.getByRole('textbox', {name: 'Username'});
        expect(usernameInputNode).toBeInTheDocument();

        userEvent.type(usernameInputNode, 'username');
        expect(usernameInputNode).toHaveValue('username');
    });

    it("shows password input field and it changes component state on change", () => {
        const passwordInputNode = screen.getByLabelText('Password');
        expect(passwordInputNode).toBeInTheDocument();

        userEvent.type(passwordInputNode, 'password');
        expect(passwordInputNode).toHaveValue('password');
    });

    it("login button dispatches login action with provided data", () => {
        const usernameInputNode = screen.getByRole('textbox', {name: 'Username'});
        const passwordInputNode = screen.getByLabelText('Password');
        const loginButtonNode = screen.getByRole('button', {name: 'Login'});
        const loggingUserSpy = jest.spyOn(userActions, 'login');

        userEvent.type(usernameInputNode, 'username');
        userEvent.type(passwordInputNode, 'password');
        userEvent.click(loginButtonNode);

        expect(loggingUserSpy).toHaveBeenCalledWith('username', 'password')
    });

    it("registration button dispatches registration action with provided data",() => {
        const usernameInputNode = screen.getByRole('textbox', {name: 'Username'});
        const passwordInputNode = screen.getByLabelText('Password');
        const registrationButtonNode = screen.getByRole('button', {name: 'Registration'});
        const registrationUserSpy = jest.spyOn(userActions, 'registration');

        userEvent.type(usernameInputNode, 'username');
        userEvent.type(passwordInputNode, 'password');
        userEvent.click(registrationButtonNode);

        expect(registrationUserSpy).toHaveBeenCalledWith('username', 'password')
    });

    it("button dispatches alert error action if username input field is empty", () => {
        const usernameInputNode = screen.getByRole('textbox', {name: 'Username'});
        const passwordInputNode = screen.getByLabelText('Password');
        const loginButtonNode = screen.getByRole('button', {name: 'Login'});
        const alertErrorSpy = jest.spyOn(alertActions, 'alertError');

        userEvent.type(usernameInputNode, '');
        userEvent.type(passwordInputNode, 'password');
        userEvent.click(loginButtonNode);

        expect(alertErrorSpy).toHaveBeenCalledWith('Username is empty');
    });

    it("button dispatches alert error action if password input field is empty", () => {
        const usernameInputNode = screen.getByRole('textbox', {name: 'Username'});
        const passwordInputNode = screen.getByLabelText('Password');
        const loginButtonNode = screen.getByRole('button', {name: 'Login'});
        const alertErrorSpy = jest.spyOn(alertActions, 'alertError');

        userEvent.type(usernameInputNode, 'username');
        userEvent.type(passwordInputNode, '');
        userEvent.click(loginButtonNode);

        expect(alertErrorSpy).toHaveBeenCalledWith('Password is empty');
    });
});