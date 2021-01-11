import React, {MouseEvent, MouseEventHandler, useEffect, useState} from 'react';

import './style.scss';

interface CustomButtonProps {
    disabled?: boolean;
    value: string;
    onClick: MouseEventHandler;
}

const CustomButton = (props: CustomButtonProps) => {
    const [coords, setCoords] = useState({x: -1, y: -1});
    const [sizes, setSizes] = useState({width: 0, height: 0});
    const [isRippling, setIsRippling] = useState(false);

    useEffect(() => {
        if(coords.x !== -1 && coords.y !== -1) {
            setIsRippling(true);
            setTimeout(() => setIsRippling(false), 350);
        } else {
            setIsRippling(false);
        }
    }, [coords]);

    useEffect(() => {
        if(!isRippling) {
            setCoords({x: -1, y: -1});
        }
    }, [isRippling]);

    const buttonOnClickHandler: MouseEventHandler = (event: MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const diameter = event.currentTarget.clientWidth/3;
        const radius = diameter/2;
        setSizes({width: diameter, height: diameter});
        setCoords({x: event.clientX - rect.left - radius, y: event.clientY - rect.top - radius});
        props.onClick(event);
    };

    return (
        <button disabled={props.disabled ?? false} className='custom-button' onClick={buttonOnClickHandler}>
            {isRippling &&
                <span style={{width: sizes.width, height: sizes.height, left: coords.x, top: coords.y}} className='custom-button__ripple'/>
            }
            {props.value}
        </button>
    );
}

export default CustomButton;