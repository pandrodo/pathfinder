import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {logout} from "../../store/users/actions";
import {alertClear, alertWarning} from "../../store/alerts/actions";
import {addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";
import {AppState} from "../../store";

import './style.scss';
import newPointIcon from "../../assets/new-point__button.svg";

const NewPointForm = () => {
    const userName = useSelector((state: AppState) => state.userPanel.user.username);
    const addingNewPoint = useSelector((state: AppState) => state.userPanel.addingNewPoint);
    const selectingPointOnMap = useSelector((state: AppState) => state.userPanel.selectingPointOnMap);

    const dispatch = useDispatch();

    useEffect(() => {
        if(!addingNewPoint) {
            dispatch(getPoints(userName));
        }
    }, [dispatch, userName, addingNewPoint]);

    const handleAddNewPointButton = () => {
        if (selectingPointOnMap) {
            dispatch(addNewPointEnd());
            dispatch(alertClear());
        } else {
            dispatch(addNewPointStart());
            dispatch(alertWarning('Click on map to add new point'));
        }
    }

    return (
        <div className='new-point' >
            <div className='new-point-__button'>
                <img
                    className='button-icon'
                    src={newPointIcon}
                    alt='New Point'
                    width='36'
                    height='36'
                />
            </div>

            {/*<input className='new-point-form__button'*/}
            {/*       type='button'*/}
            {/*       value={ selectingPointOnMap ? "Stop" : "New Point" }*/}
            {/*       disabled={addingNewPoint}*/}
            {/*       onClick={handleAddNewPointButton}*/}
            {/*/>*/}
            {/*<input className='new-point-form__button'*/}
            {/*       type='button'*/}
            {/*       value='Logout'*/}
            {/*       onClick={() => dispatch(logout())}*/}
            {/*/>*/}
        </div>
    );
}

export default NewPointForm;