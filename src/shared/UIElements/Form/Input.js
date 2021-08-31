import React, { useReducer, useEffect } from "react";

import "./Input.css";
import { validate } from "../../util/validators/validators";

const inputReducer = (state, action) => {
    switch (action.type) {
        case "change":
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators),
            };
        case "ON_TOUCH":
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

const Input = (props) => {
    const [state, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || "",
        isTouched: false,
        isValid: props.valid || false,
    });

    const touchHandler = () => {
        dispatch({
            type: "ON_TOUCH",
        });
    };

    const changeHandler = (event) => {
        dispatch({
            type: "change",
            val: event.target.value,
            validators: props.validators,
        });
    };

    const element =
        props.element === "input" ? (
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={state.value}
            />
        ) : (
            <textarea
                id={props.id}
                rows={props.row || 3}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={state.value}
            />
        );

    const { id, afterInput } = props;
    const { isValid, value } = state;

    useEffect(() => {
        if (!afterInput) return;
        afterInput(id, value, isValid);
    }, [id, isValid, value, afterInput]);

    return (
        <div
            className={`form-control ${
                !state.isValid && state.isTouched && "form-control__invalid"
            }`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!state.isValid && state.isTouched && (
                <span>
                    <sub>{props.errText}</sub>
                </span>
            )}
        </div>
    );
};

export default Input;
