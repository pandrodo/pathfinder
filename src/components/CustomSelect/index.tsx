import React, {useState, MouseEvent, MouseEventHandler} from 'react';
import classNames from 'classnames';

import arrow from '../../assets/custom-select__arrow.svg';

import './style.scss';

interface CustomSelectProps {
    border: boolean;
    dark?: boolean;
    selectedOption: {name: string, value: string};
    options: {name: string, value: string}[];
    placeholder?: string;
    onChange: MouseEventHandler;
}

const CustomSelect = (props: CustomSelectProps) => {
    const [focused, setFocused] = useState(false);

    const selectClickHandler: MouseEventHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(focused) {
            event.currentTarget.blur();
        } else {
            setFocused(true);
        }
    }

    const optionClickHandler: MouseEventHandler = (event: MouseEvent<HTMLDivElement>) => {
        if(event.currentTarget.dataset.name && event.currentTarget.dataset.value) {
            props.onChange(event);
        }
    }

    return (
        <div
            className={classNames('custom-select', {'custom-select_dark': props.dark, 'custom-select_with-border': props.border, 'custom-select_with-placeholder': props.selectedOption.name === ''})}
            tabIndex={0}
            onClick={selectClickHandler}
            onBlur={() => setFocused(false)}
        >
            {props.placeholder && props.selectedOption.name === '' ? props.placeholder : props.selectedOption.name}
            <img className='custom-select__arrow' src={arrow} alt='Arrow' width='10' height='6'/>
            <div className={classNames('custom-select__dropdown', {'custom-select__dropdown_dark': props.dark})}>
                {props.options.map(option =>
                        <div className={classNames('custom-select__option', {'custom-select__option_dark': props.dark})} tabIndex={0} data-name={option.name} data-value={option.value} key={option.value} onMouseDown={optionClickHandler}>
                            {option.name}
                        </div>
                )}
            </div>
        </div>
    );
}

export default CustomSelect;