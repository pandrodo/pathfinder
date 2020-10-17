import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import './style.css';

import {login, registration} from "../../store/users/actions";
import {AppState} from "../../store";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitType, setSubmitType] = useState('');
    const loggingIn = useSelector((state: AppState) => state.userPanel.loggingIn);

    const dispatch = useDispatch();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (username && password) {
            if (submitType === 'login') dispatch(login(username, password));
            if (submitType === 'registration') dispatch(registration(username, password));
        }
    }

    return (
        <form className='login-form'
              name='login-form'
              onSubmit={handleSubmit}>
            <div className='login-form__item'>
                <label className='login-form__label'>
                    Логин
                </label>
                <input className='login-form__input'
                       type='text'
                       name='username'
                       autoComplete='on'
                       value={username}
                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                />
            </div>
            <div className='login-form__item'>
                <label className='login-form__label'>
                    Пароль
                </label>
                <input className='login-form__input'
                       type='password'
                       name='password'
                       autoComplete='on'
                       value={password}
                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
            </div>
            <div className='login-form__item'>
                <input className='login-form__button'
                       type='submit'
                       value='Войти'
                       disabled={loggingIn}
                       onClick={() => setSubmitType('login')}
                />
            </div>
            <div className='login-form__item'>
                <input className='login-form__button'
                       type='submit'
                       value='Регистрация'
                       disabled={loggingIn}
                       onClick={() => setSubmitType('registration')}
                />
            </div>
        </form>
    );
}

export default LoginForm;