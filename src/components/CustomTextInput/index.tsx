import React, {ChangeEventHandler} from 'react';

import './style.scss';

interface CustomTextInputProps {
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: ChangeEventHandler;
}

const CustomTextInput = (props: CustomTextInputProps) => {
    return(
        <div className='custom-text-input'>
            <input
                className='custom-text-input__input'
                type={props.type}
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                autoComplete='on'
            />
            <div
                className={`custom-text-input__placeholder ${props.value.length > 0 ? 'custom-text-input__placeholder_not-empty': null}`}>
                {props.placeholder}
            </div>
        </div>
    );
}

export default CustomTextInput;