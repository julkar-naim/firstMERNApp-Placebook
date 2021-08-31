import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
    if (props.to) {
        return (
            <Link to={props.to}>
              <button
                className={`button ${props.danger && "delete"} ${
                        props.disabled && "disabled"
                    } ${props.classes}`}
                onClick={props.onClick}
                disabled={props.disabled}
              >
                {props.children}
              </button>
            </Link>
        );
    }
    return (
        <button
r         className={`button ${props.danger && "delete"} ${
                props.disabled && "disabled"
            } ${props.classes}`}
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.children}
        </button>
    );
};

export default Button;
