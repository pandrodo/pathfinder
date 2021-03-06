import React, {FormEvent, MouseEvent, MouseEventHandler, useState} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {logout, setActivePanel} from "../../store/users/actions";
import {alertClear} from "../../store/alerts/actions";

import Alert from "../Alert";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";

import closeButton from '../../assets/close__button_purple.svg';
import profileButton from '../../assets/profile__button.svg';
import profileButtonDark from '../../assets/profile__button_dark.svg';
import profileImage from '../../assets/profile__image.svg';
import profileImageDark from '../../assets/profile__image_dark.svg';

import './style.scss';

const Profile = () => {
    const [currentForm, setCurrentForm] = useState('login');

    const loggedIn = useSelector((state: AppState) => state.userPanel.loggedIn);
    const user = useSelector((state: AppState) => state.userPanel.user);
    const activePanel = useSelector((state: AppState) => state.userPanel.activePanel);
    const alert = useSelector((state: AppState) => state.alert);
    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    const togglePanel = () => {
        activePanel === 'profile' ? dispatch(setActivePanel('none')) : dispatch(setActivePanel('profile'));
    };

    const closeButtonOnClickHandler: MouseEventHandler = (event: MouseEvent) => {
        if(alert.source === 'Profile') {
            dispatch(alertClear());
        }
        togglePanel();
    };

    return(
        <div className='profile'>
            <img className='profile__button' src={theme === 'light' ? profileButton : profileButtonDark} alt='Input' width='36' height='36' onClick={togglePanel}/>
            {activePanel === 'profile' &&
                <div className={classNames('profile__container', {'profile__container_dark': theme === 'dark'})}>
                    <div className={classNames('profile__panel', {'profile__panel_dark': theme === 'dark'})}>
                        <img className='profile__close-button' src={closeButton} alt='Close' width='16' height='16' onClick={closeButtonOnClickHandler}/>
                        <img className='profile__image' src={theme === 'light' ? profileImage : profileImageDark} alt='Profile' width='80' height='80'/>
                        {loggedIn &&
                        <div className='profile__title'>
                            Profile
                        </div>
                        }
                        {loggedIn &&
                        <form className='profile__form'>
                            <div className='profile__user'>{user.username}</div>
                            <input
                                className='profile__form-button'
                                type='submit'
                                value='Log out'
                                onClick={(event: FormEvent) => {event.preventDefault(); dispatch(logout())}}
                            />
                        </form>
                        }
                        {!loggedIn &&
                        <div className='profile__title'>
                            <input
                                className={classNames('profile__slider-button', {'profile__slider-button_active': currentForm === 'login'}, {'profile__slider-button_dark': theme === 'dark'})}
                                type='button'
                                value='Log in'
                                onClick={() => setCurrentForm('login')}
                            />
                            <input
                                className={classNames('profile__slider-button', {'profile__slider-button_active': currentForm === 'signup'}, {'profile__slider-button_dark': theme === 'dark'})}
                                type='button'
                                value='Sign up'
                                onClick={() => setCurrentForm('signup')}
                            />
                        </div>
                        }
                        {!loggedIn && alert.source === 'Profile' && <Alert in_panel={true}/>}
                        {!loggedIn && currentForm === 'login' && <LoginForm/>}
                        {!loggedIn && currentForm === 'signup' && <SignupForm/>}
                    </div>
                </div>
            }
        </div>
    );
}

export default Profile;