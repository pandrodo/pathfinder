import React, {EventHandler, FormEvent, useState} from 'react';

import './style.scss';

interface InputProps {
    placeholder: string;
    value: string;
    onChange: EventHandler<FormEvent>;
}

const Input = (props: InputProps) => {
    return(
        <div className='input-wrapper'>
            <input className='input' type='text' value={props.value} onChange={props.onChange}/>
            <div className={`placeholder ${props.value.length > 0 ? 'placeholder_not-empty': null}`}>{props.placeholder}</div>
        </div>
    );
}

export default Input;