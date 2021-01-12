import React, {FormEvent, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {registration} from "../../store/users/actions";
import {alertError} from "../../store/alerts/actions";

import CustomTextInput from "../CustomTextInput";
import CustomButton from "../CustomButton";

import './style.scss';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    const signupHandler = (event: FormEvent) => {
        event.preventDefault();

        if (username !== '') {
            if (password !== '') {
                if (confirmPassword !== '') {
                    if (password === confirmPassword) {
                        dispatch(registration(username, password));
                    } else {
                        dispatch(alertError('Passwords should be same', 'Profile'));
                    }
                } else {
                    dispatch(alertError('Confirm password field is empty', 'Profile'));
                }
            } else {
                dispatch(alertError('Password field is empty', 'Profile'));
            }
        } else {
            dispatch(alertError('Username field is empty', 'Profile'));
        }
    };

    return (
        <form className='profile__form' onSubmit={signupHandler}>
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
            <CustomTextInput
                dark={theme === 'dark'}
                type='password'
                name='confirmPassword'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
            />
            <CustomButton value='Sign Up' onClick={signupHandler}/>
        </form>
    );
}

export default SignupForm;