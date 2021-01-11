import React, {useState, MouseEvent, MouseEventHandler} from 'react';

import arrow from '../../assets/custom-select__arrow.svg';

import './style.scss';

interface CustomSelectProps {
    border: boolean;
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
            className={`custom-select ${props.border ? 'custom-select_with-border' : null} ${props.selectedOption.name === '' ? 'custom-select_with-placeholder' : null}`}
            tabIndex={0}
            onClick={selectClickHandler}
            onBlur={() => setFocused(false)}
        >
            {props.placeholder && props.selectedOption.name === '' ? props.placeholder : props.selectedOption.name}
            <img className='custom-select__arrow' src={arrow} alt='Arrow' width='10' height='6'/>
            <div className='custom-select__dropdown'>
                {props.options.map(option =>
                        <div className='custom-select__option' tabIndex={0} data-name={option.name} data-value={option.value} key={option.value} onMouseDown={optionClickHandler}>
                            {option.name}
                        </div>
                )}
            </div>
        </div>
    );
}

export default CustomSelect;