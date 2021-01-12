import React, {ChangeEventHandler} from 'react';
import classNames from 'classnames';

import './style.scss';

interface CustomTextInputProps {
    dark?: boolean;
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
                className={classNames('custom-text-input__input', {'custom-text-input__input_dark': props.dark})}
                type={props.type}
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                autoComplete='on'
            />
            <div
                className={classNames('custom-text-input__placeholder', {'custom-text-input__placeholder_not-empty': props.value.length > 0})}>
                {props.placeholder}
            </div>
        </div>
    );
}

export default CustomTextInput;