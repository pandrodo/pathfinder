import React, {FormEvent, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {login} from "../../store/users/actions";
import {alertError} from "../../store/alerts/actions";
import CustomTextInput from "../CustomTextInput";

import './style.scss';
import CustomButton from "../CustomButton";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loggingIn = useSelector((state: AppState) => state.userPanel.loggingIn);
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
                type='text'
                name='username'
                placeholder='Username'
                value={username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
            />
            <CustomTextInput
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