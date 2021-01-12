import React, {useEffect} from "react";
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {loginSuccess} from "../../store/users/actions";

import NewPoint from "../NewPoint";
import Settings from "../Settings";
import Profile from "../Profile";

import './style.scss';

const UserPanel = () => {
    const loggedIn = useSelector((state: AppState) => state.userPanel.loggedIn);

    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch(loginSuccess(user));
        }
    }, [dispatch]);

    return(
        <div className={classNames('user-panel', {'user-panel_logged-in': loggedIn})}>
            <Profile />
            <Settings />
            {loggedIn ? <NewPoint /> : null}
        </div>
    );
}

export default UserPanel;