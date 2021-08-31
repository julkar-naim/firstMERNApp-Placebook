import React from 'react';

const Header = props => {
    return (
        <div className={`header ${props.classes}`}>
            {props.children}
        </div>
    );
}

export default Header;
