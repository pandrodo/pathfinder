import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {alertClear, alertWarning} from "../../store/alerts/actions";
import {addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";
import {AppState} from "../../store";

import newPointButtonAdd from "../../assets/new-point__button_add.svg";
import newPointButtonCancel from "../../assets/new-point__button_cancel.svg";

import './style.scss';

const NewPoint = () => {
    const userName = useSelector((state: AppState) => state.userPanel.user.username);
    const addingNewPoint = useSelector((state: AppState) => state.userPanel.addingNewPoint);
    const selectingPointOnMap = useSelector((state: AppState) => state.userPanel.selectingPointOnMap);

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
                src={selectingPointOnMap ? newPointButtonCancel : newPointButtonAdd}
                alt='New Point'
                width='36'
                height='36'
                onClick={handleNewPointButton}
            />
        </div>
    );
}

export default NewPoint;