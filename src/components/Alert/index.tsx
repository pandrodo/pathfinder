import React from 'react';
import { useSelector } from "react-redux";

import './style.css';

import { AppState } from "../../store";

const Alert = () => {
    const alert = useSelector((state: AppState) => state.alert);

    return (
        <div role='alert' aria-label='Error' className={`alert alert_${alert.style}`}>
            { alert.message }
        </div>
    );
}

export default Alert;
