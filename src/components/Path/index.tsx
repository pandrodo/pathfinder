import React, {useEffect, useState, MouseEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {setStartPoint, setEndPoint} from "../../store/inputForm/actions";
import CustomSelect from "../CustomSelect";

import './style.scss';

const Path = () => {
    const [pointOptions, setPointOptions] = useState<{name: string, value: string}[]>([]);

    const startPoint = useSelector((state: AppState) => state.inputForm.startPoint);
    const endPoint = useSelector((state: AppState) => state.inputForm.endPoint);
    const points = useSelector((state: AppState) => state.userPanel.points);
    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        if (points.length > 0) {
            setPointOptions(points.map((point) => {
                return {name: point.name, value: point.nodeId}
            }));
        }
    }, [dispatch, points]);

    const startPointSelectChangeHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(event.currentTarget.dataset.name && event.currentTarget.dataset.value) {
            const startPoint = {name: event.currentTarget.dataset.name, nodeId: event.currentTarget.dataset.value};
            dispatch(setStartPoint(startPoint));
        }
    }

    const endPointSelectChangeHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(event.currentTarget.dataset.name && event.currentTarget.dataset.value) {
            const endPoint = {name: event.currentTarget.dataset.name, nodeId: event.currentTarget.dataset.value};
            dispatch(setEndPoint(endPoint));
        }
    }

    return (
        <div className='path'>
            <CustomSelect
                border={false}
                dark={theme === 'dark'}
                selectedOption={{name: startPoint.name, value: startPoint.nodeId}}
                options={pointOptions}
                placeholder='Start'
                onChange={startPointSelectChangeHandler}
            />
            <CustomSelect
                border={false}
                dark={theme === 'dark'}
                selectedOption={{name: endPoint.name, value: endPoint.nodeId}}
                options={pointOptions}
                placeholder='End'
                onChange={endPointSelectChangeHandler}
            />
        </div>
    );
}

export default Path;