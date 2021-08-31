import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case "ON_INPUT":
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid &= action.inputIsValid;
                } else {
                    formIsValid &= state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.inputIsValid
                    }
                },
                formStateIsValid: formIsValid
            };
        case "SET_DATA":
            return {
                inputs: action.inputs,
                formStateIsValid: action.formValidity
            };
        default:
            return state;
    }
};

const useForm = (inputs, formInitialState) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: inputs,
        formStateIsValid: formInitialState
    });

    const afterInputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: "ON_INPUT",
            value: value,
            inputIsValid: isValid,
            inputId: id
        });
    }, []);

    const setFormData = useCallback((inputs, formValidity) => {
        dispatch({
            type: "SET_DATA",
            inputs: inputs,
            formValidity: formValidity
        });
    }, []);

    return [formState, afterInputHandler, setFormData];
};

export default useForm;
