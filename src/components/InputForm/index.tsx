import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {setStartPoint, setEndPoint, setAlgorithm} from "../../store/inputForm/actions";
import {AppState} from "../../store";

import './style.scss';

const InputForm = () => {
    const [pathfinderOptions, setPathfinderOptions] = useState<JSX.Element[]>([]);
    const [pointOptions, setPointOptions] = useState<JSX.Element[]>([]);

    const inputForm = useSelector((state: AppState) => state.inputForm);
    const points = useSelector((state: AppState) => state.userPanel.points);
    const availablePathfinders = useSelector((state: AppState) => state.map.availablePathfinders);

    const dispatch = useDispatch();

    useEffect(() => {
        if (availablePathfinders.length > 0) {
            setPathfinderOptions(availablePathfinders.map((pathfinder) =>
                <option key={pathfinder} value={pathfinder}>
                    {pathfinder}
                </option>
            ));
            dispatch(setAlgorithm(availablePathfinders[0]));
        }
    }, [dispatch, availablePathfinders]);

    useEffect(() => {
        if (points.length > 0) {
            setPointOptions(points.map((point) =>
                <option key={point.nodeId} value={point.nodeId}>
                    {point.name}
                </option>
            ));
            dispatch(setStartPoint(points[0].nodeId));
            dispatch(setEndPoint(points[0].nodeId));
        }
    }, [dispatch, points]);

    return (
        <div className='input-form' role='form' aria-label="Input Form">
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Начало
                    <select className='input-form__select'
                            value={inputForm.startPoint}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setStartPoint(event.target.value))}
                    >
                        {pointOptions}
                    </select>
                </label>
            </div>
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Конец
                    <select className='input-form__select'
                            value={inputForm.endPoint}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setEndPoint(event.target.value))}
                    >
                        {pointOptions}
                    </select>
                </label>
            </div>
            <div className='input-form__item'>
                <label className='input-form__label'>
                    Алгоритм
                    <select className='input-form__select'
                            value={inputForm.algorithm}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => dispatch(setAlgorithm(event.target.value))}
                    >
                        {pathfinderOptions}
                    </select>
                </label>
            </div>
        </div>
    );
}

export default InputForm;