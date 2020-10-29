import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {logout} from "../../store/users/actions";
import {alertClear, alertWarning} from "../../store/alerts/actions";
import {addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";
import {AppState} from "../../store";

import './style.css';

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
            dispatch(alertWarning('Выберете точку на карте'));
        }
    }

    return (
        <div className='new-point-form'
             role='form'
             aria-label="New Point Form"
        >
            <input className='new-point-form__button'
                   type='button'
                   value={ selectingPointOnMap ? "Остановить выбор точки" : "Добавить новую точку" }
                   disabled={addingNewPoint}
                   onClick={handleAddNewPointButton}
            />
            <input className='new-point-form__button'
                   type='button'
                   value='Выйти'
                   onClick={() => dispatch(logout())}
            />
        </div>
    );
}

export default NewPointForm;