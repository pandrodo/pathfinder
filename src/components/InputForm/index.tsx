import React from 'react';
import {useDispatch, useSelector} from "react-redux";

import './style.css';

import {setStartPoint, setEndPoint, setAlgorithm} from "../../store/inputForm/actions";
import {AppState} from "../../store";

const InputForm = () => {
    const inputForm = useSelector((state: AppState) => state.inputForm);
    const points = useSelector((state: AppState) => state.userPanel.points);
    const availablePathfinders = useSelector((state: AppState) => state.map.availablePathfinders);

    const dispatch = useDispatch();

    const pointOptions: JSX.Element[] = points.map((point) =>
        <option key={point.nodeId} value={point.nodeId}>{point.name}</option>
    );

    const pathfinderOptions: JSX.Element[] = availablePathfinders.map((pathfinder) =>
        <option key={pathfinder} value={pathfinder}>{pathfinder}</option>
    );

    return (
        <div className='input-form'>
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Начало
                </label>
                <select className='input-form__select'
                        value={inputForm.startPoint}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setStartPoint(event.target.value))}
                >
                    {pointOptions}
                </select>
            </div>
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Конец
                </label>
                <select className='input-form__select'
                        value={inputForm.endPoint}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setEndPoint(event.target.value))}
                >
                    {pointOptions}
                </select>
            </div>
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Алгоритм
                </label>
                <select className='input-form__select'
                        value={inputForm.algorithm}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setAlgorithm(event.target.value))}
                >
                    {pathfinderOptions}
                </select>
            </div>
            {/*<div className='control-panel-input'>*/}
            {/*    <label>*/}
            {/*        Расстояние*/}
            {/*        <select className='custom-select' defaultValue='distance' disabled>*/}
            {/*            <option value='distance'>{this.props.inputForm.pathLength}</option>*/}
            {/*        </select>*/}
            {/*    </label>*/}
            {/*</div>*/}
        </div>
    );
}

export default InputForm;