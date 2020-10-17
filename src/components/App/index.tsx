import React from 'react';
import { useSelector } from "react-redux";

import './style.css';

import Alert from "../Alert";
import InputForm from "../InputForm";
import HomePanel from "../HomePanel";
import LoginForm from "../LoginForm";
import LeafletMap from "../LeafletMap";
import { AppState } from "../../store";

const App = () => {
    const loggedIn = useSelector((state: AppState) => state.userPanel.loggedIn);
    const alert = useSelector((state: AppState) => state.alert);

    return (
        <div className='application'>
            <div className='control-panel'>
                <InputForm />
                <div className='user-panel'>
                    { alert.message ? <Alert /> : null }
                    { loggedIn ? <HomePanel /> : <LoginForm /> }
                </div>
            </div>
            <LeafletMap />
        </div>
    );
}

export default App;
