import React, {useEffect} from "react";
import NewPoint from "../NewPoint";
import Profile from "../Profile";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {loginSuccess} from "../../store/users/actions";

import './style.scss';
import Settings from "../Settings";

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
        <div className={`user-panel ${loggedIn && 'user-panel_logged-in'}`}>
            <Profile />
            <Settings />
            {loggedIn ? <NewPoint /> : null}
        </div>
    );
}

export default UserPanel;