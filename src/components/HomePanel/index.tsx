import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import './style.css';

import {logout} from "../../store/users/actions";
import {alertClear, alertWarning} from "../../store/alerts/actions";
import {addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";
import {AppState} from "../../store";

const HomePanel = () => {
    const userName = useSelector((state: AppState) => state.userPanel.user.username);
    const addingNewPoint = useSelector((state: AppState) => state.userPanel.addingNewPoint);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPoints(userName));
    }, [dispatch, userName]);

    const handleAddNewPointButton = () => {
        if (addingNewPoint) {
            dispatch(addNewPointEnd());
            dispatch(alertClear());
        } else {
            dispatch(addNewPointStart());
            dispatch(alertWarning('Выберете точку на карте'));
        }
    }

    return (
        <div className='new-point-form'>
            <input className='new-point-form__button'
                   type='button'
                   value={ addingNewPoint ? "Остановить выбор точки" : "Добавить новую точку" }
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

export default HomePanel;