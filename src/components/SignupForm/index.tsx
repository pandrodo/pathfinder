import React, {FormEvent, useState} from 'react';
import {useDispatch} from "react-redux";

import {registration} from "../../store/users/actions";
import {alertError} from "../../store/alerts/actions";
import CustomTextInput from "../CustomTextInput";

import './style.scss';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            <CustomTextInput
                type='password'
                name='confirmPassword'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
            />
            <input
                className='profile__form-button'
                type='submit'
                value='Sign Up'
            />
        </form>
    );
}

export default SignupForm;