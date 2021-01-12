import React, {MouseEvent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";

import {AppState} from "../../store";
import {setAlgorithm} from "../../store/inputForm/actions";
import {setActivePanel} from "../../store/users/actions";
import {setTheme} from "../../store/users/actions";

import CustomSelect from "../CustomSelect";

import closeButton from "../../assets/close__button_purple.svg";
import settingsButton from '../../assets/settings__button.svg';
import settingsButtonDark from '../../assets/settings__button_dark.svg';
import settingsImage from '../../assets/settings__image.svg';
import settingsImageDark from '../../assets/settings__image_dark.svg';

import './style.scss';

const Settings = () => {
    const [pathfinderOptions, setPathfinderOptions] = useState<{name: string, value: string}[]>([]);

    const pathfinder = useSelector((state: AppState) => state.inputForm.algorithm);
    const availablePathfinders = useSelector((state: AppState) => state.map.availablePathfinders);
    const activePanel = useSelector((state: AppState) => state.userPanel.activePanel);
    const theme = useSelector((state: AppState) => state.userPanel.theme);
    const dispatch = useDispatch();

    const togglePanel = () => {
        activePanel === 'settings' ? dispatch(setActivePanel('none')) : dispatch(setActivePanel('settings'));
    };

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if(theme) {
            dispatch(setTheme(theme));
        }
    }, [dispatch]);

    useEffect(() => {
        if(availablePathfinders.length > 0) {
            setPathfinderOptions(availablePathfinders.map((pathfinder) => {
                return {name: pathfinder, value: pathfinder}
            }));
            dispatch(setAlgorithm(availablePathfinders[0]));
        }
    }, [dispatch, availablePathfinders]);

    const pathfinderSelectChangeHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(event.currentTarget.dataset.name && event.currentTarget.dataset.value) {
            const pathfinder = {name: event.currentTarget.dataset.name, value: event.currentTarget.dataset.value};
            dispatch(setAlgorithm(pathfinder.value));
        }
    }

    const themeSelectChangeHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(event.currentTarget.dataset.name && event.currentTarget.dataset.value) {
            const theme = {name: event.currentTarget.dataset.name, value: event.currentTarget.dataset.value};
            localStorage.setItem('theme', theme.value);
            dispatch(setTheme(theme.value));
        }
    }

    return(
        <div className='settings'>
            <img className='settings__button' src={theme === 'light' ? settingsButton : settingsButtonDark} alt='Settings' width='36' height='36' onClick={togglePanel}/>
            {activePanel === 'settings' &&
                <div className={classNames('settings__container', {'settings__container_dark': theme === 'dark'})}>
                    <div className={classNames('settings__panel', {'settings__panel_dark': theme === 'dark'})}>
                        <img className='settings__close-button' src={closeButton} alt='Close' width='16' height='16' onClick={togglePanel}/>
                        <img className='settings__image' src={theme === 'light' ? settingsImage : settingsImageDark} alt='Settings' width='80' height='80'/>
                        <div className='settings__title'>
                            Settings
                        </div>
                        <div className='settings__form'>
                            <CustomSelect
                                border={true}
                                dark={theme === 'dark'}
                                selectedOption={{name: pathfinder, value: pathfinder}}
                                options={pathfinderOptions}
                                onChange={pathfinderSelectChangeHandler}
                            />
                            <CustomSelect
                                border={true}
                                dark={theme === 'dark'}
                                selectedOption={{name: theme.charAt(0).toUpperCase() + theme.slice(1) + ' Theme', value: theme}}
                                options={[{name: 'Light Theme', value: 'light'}, {name: 'Dark Theme', value: 'dark'}]}
                                onChange={themeSelectChangeHandler}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Settings;