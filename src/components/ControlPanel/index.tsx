import React from 'react';
import {useSelector} from "react-redux";
import {AppState} from "../../store";

import Path from "../Path";
import Alert from "../Alert";
import UserPanel from "../UserPanel";

import './style.scss';

const ControlPanel = () => {
    const alert = useSelector((state: AppState) => state.alert);

    return(
        <div className='control-panel'>
            <div className='toolbar'>
                <Path />
                {alert.message ? <Alert /> : null}
            </div>
            <UserPanel />
        </div>
    );
}

export default ControlPanel;