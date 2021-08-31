import React from 'react';

import './Avatar.css'

const Avatar = props => {
    return (
        <img className={`avatar ${props.classes}`} src={props.image} alt={props.alt} />
    );
}

export default Avatar;
