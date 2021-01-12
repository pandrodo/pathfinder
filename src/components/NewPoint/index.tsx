import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {alertClear, alertWarning} from "../../store/alerts/actions";
import {addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";
import {AppState} from "../../store";

import newPointButtonAdd from "../../assets/new-point__button_add.svg";
import newPointButtonAddDark from '../../assets/new-point__button_add_dark.svg';
import newPointButtonCancel from "../../assets/new-point__button_cancel.svg";
import newPointButtonCancelDark from '../../assets/new-point__button_cancel_dark.svg';

import './style.scss';

const NewPoint = () => {
    const userName = useSelector((state: AppState) => state.userPanel.user.username);
    const addingNewPoint = useSelector((state: AppState) => state.userPanel.addingNewPoint);
    const selectingPointOnMap = useSelector((state: AppState) => state.userPanel.selectingPointOnMap);
    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!addingNewPoint) {
            dispatch(getPoints(userName));
        }
    }, [dispatch, userName, addingNewPoint]);

    const handleNewPointButton = () => {
        if (selectingPointOnMap) {
            dispatch(addNewPointEnd());
            dispatch(alertClear());
        } else {
            dispatch(addNewPointStart());
            dispatch(alertWarning('Click on map to add new point', 'NewPoint'));
        }
    }

    return (
        <div className='new-point' >
            <img
                className='new-point__button'
                src={selectingPointOnMap
                    ? theme === 'light' ? newPointButtonCancel : newPointButtonCancelDark
                    : theme === 'light' ? newPointButtonAdd : newPointButtonAddDark}
                alt='New Point'
                width='36'
                height='36'
                onClick={handleNewPointButton}
            />
        </div>
    );
}

export default NewPoint;