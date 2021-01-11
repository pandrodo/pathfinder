import React from 'react';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {alertClear} from "../../store/alerts/actions";

import closeButtonWhite from "../../assets/close__button_white.svg";
import closeButtonBlack from "../../assets/close__button_black.svg";

import './style.scss';

interface AlertProps {
    in_panel?: boolean;
}

const Alert = (props: AlertProps) => {
    const alert = useSelector((state: AppState) => state.alert);

    const dispatch = useDispatch();

    return (
        <div role='alert' aria-label='Error' className={`alert alert_${alert.style}${props.in_panel ? ' alert_in-panel' : ''}`}>
            <img
                className='alert__close-button'
                src={alert.style === 'warning' ? closeButtonBlack : closeButtonWhite}
                alt='Close'
                width='12'
                height='12'
                onClick={() => dispatch(alertClear())}
            />
            {alert.message}
        </div>
    );
}

export default Alert;
