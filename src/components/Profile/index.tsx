import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {alertError} from "../../store/alerts/actions";
import {login, registration} from "../../store/users/actions";
import {AppState} from "../../store";

import profileIcon from '../../assets/profile.svg';

import './style.scss';

const Profile = () => {
    const [toggled, setToggled] = useState(false);
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
        <div className='profile'>
                <img className='profile__icon' src={profileIcon} alt='Input' width='36' height='36' onClick={() => setToggled(!toggled)}/>
                { toggled &&
                <div className='profile__form'>
                    <input className='profile__input'
                           type='text'
                           name='username'
                           autoComplete='on'
                           value={username}
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                    <input className='profile__input'
                           type='password'
                           name='password'
                           autoComplete='on'
                           value={password}
                           onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                    <button className='profile__button'
                            type='submit'
                            value='login'
                            disabled={loggingIn}
                            onClick={() => clickHandler(login)}
                    >
                        Login
                    </button>
                </div>
                }
                {/*<div className='login-form__item'>*/}
                {/*    <button className='login-form__button'*/}
                {/*           type='submit'*/}
                {/*           value='registration'*/}
                {/*           disabled={loggingIn}*/}
                {/*           onClick={() => clickHandler(registration)}*/}
                {/*    >*/}
                {/*        Registration*/}
                {/*    </button>*/}
                {/*</div>*/}
        </div>
    );
}

export default Profile;