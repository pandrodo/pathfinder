import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {alertError} from "../../store/alerts/actions";
import {login, registration} from "../../store/users/actions";
import {AppState} from "../../store";

import './style.scss';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loggingIn = useSelector((state: AppState) => state.userPanel.loggingIn);

    const dispatch = useDispatch();

    const clickHandler = (action: typeof login | typeof registration) => {
        if (username !== '') {
            if (password !== '') {
                dispatch(action(username, password));
            } else {
                dispatch(alertError('Password is empty'));
            }
        } else {
            dispatch(alertError('Username is empty'));
        }
    }

    return (
        <div className='login-form' role='form' aria-label="Login Form">
            <div className='login-form__item'>
                <label className='login-form__label'>
                    Username
                    <input className='login-form__input'
                           type='text'
                           name='username'
                           autoComplete='on'
                           value={username}
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                </label>
            </div>
            <div className='login-form__item'>
                <label className='login-form__label'>
                    Password
                    <input className='login-form__input'
                           type='password'
                           name='password'
                           autoComplete='on'
                           value={password}
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                </label>
            </div>
            <div className='login-form__item'>
                <button className='login-form__button'
                       type='submit'
                       value='login'
                       disabled={loggingIn}
                       onClick={() => clickHandler(login)}
                >
                    Login
                </button>
            </div>
            <div className='login-form__item'>
                <button className='login-form__button'
                       type='submit'
                       value='registration'
                       disabled={loggingIn}
                       onClick={() => clickHandler(registration)}
                >
                    Registration
                </button>
            </div>
        </div>
    );
}

export default LoginForm;