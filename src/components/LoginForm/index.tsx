import React, {FormEvent, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {login} from "../../store/users/actions";
import {alertError} from "../../store/alerts/actions";

import CustomTextInput from "../CustomTextInput";
import CustomButton from "../CustomButton";

import './style.scss';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loggingIn = useSelector((state: AppState) => state.userPanel.loggingIn);
    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    const loginHandler = (event: FormEvent) => {
        event.preventDefault();

        if (username !== '') {
            if (password !== '') {
                dispatch(login(username, password));
            } else {
                dispatch(alertError('Password is empty', 'Profile'));
            }
        } else {
            dispatch(alertError('Username is empty', 'Profile'));
        }
    }

    return (
        <form className='profile__form' onSubmit={loginHandler}>
            <CustomTextInput
                dark={theme === 'dark'}
                type='text'
                name='username'
                placeholder='Username'
                value={username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
            />
            <CustomTextInput
                dark={theme === 'dark'}
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            />
            <div
                className='custom-text-input-plug'
            />
            <CustomButton disabled={loggingIn} value='Log In' onClick={loginHandler}/>
        </form>
    );
}

export default LoginForm;