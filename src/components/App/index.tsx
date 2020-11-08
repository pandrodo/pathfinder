import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Alert from "../Alert";
import InputForm from "../InputForm";
import NewPointForm from "../NewPointForm";
import LoginForm from "../LoginForm";
import LeafletMap from "../LeafletMap";
import { AppState } from "../../store";
import {loginSuccess} from "../../store/users/actions";

import './style.scss';

const App = () => {
    const loggedIn = useSelector((state: AppState) => state.userPanel.loggedIn);
    const alert = useSelector((state: AppState) => state.alert);

    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch(loginSuccess(user));
        }
    }, [dispatch]);

    return (
        <div className='application'>
            <div className='control-panel'>
                <InputForm />
                {/*<div className='user-panel'>*/}
                    { alert.message ? <Alert /> : null }
                    { loggedIn ? <NewPointForm /> : <LoginForm /> }
                {/*</div>*/}
            </div>
            <LeafletMap />
        </div>
    );
}

export default App;
