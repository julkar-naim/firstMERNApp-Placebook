import React, { useState, useContext } from "react";
import useForm from "../../shared/util/hooks/form-hook";

import Input from "../../shared/UIElements/Form/Input";
import Button from "../../shared/UIElements/Button/Button";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_EMAIL
} from "../../shared/util/validators/validators";
import "../NewPlace/NewPlace.css";
import "./Authentication.css";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHTTPClient } from "../../shared/util/hooks/http-hook";
import ImageUpload from "../../shared/UIElements/Form/ImageUpload";

const NewPlace = () => {
    const auth = useContext(AuthContext);

    const [wannaSignUp, setWannaSignUp] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const [hasError, setHasError] = useState();
    const { isLoading, hasError, sendRequest, clearError } = useHTTPClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValid: false
            }
        },
        false
    );

    const switchToSignUp = () => {
        if (wannaSignUp) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            );
        }
        setWannaSignUp((prevSignUpState) => !prevSignUpState);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        if (wannaSignUp) {
            try {
                const formData = new FormData();
                formData.append("name", formState.inputs.name.value);
                formData.append("email", formState.inputs.email.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("image", formState.inputs.image.value);
                const response = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
                    "post",
                    formData
                );
                auth.login(response.userId, response.token);
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const response = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/user/login`,
                    "post",
                    {
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }
                );
                auth.login(response.userId, response.token);
            } catch (err) {
                console.log(err);
            }
        }
    };

    // const errorHandler = () => {
    //     setHasError(null);
    // };

    return (
        <React.Fragment>
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}
            {isLoading && <LoadingSpinner asOverlay />}
            <form className="place-form auth" onSubmit={submitHandler}>
                {wannaSignUp && (
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Name"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errText="Enter a valid name"
                        afterInput={inputHandler}
                    />
                )}
                <Input
                    id="email"
                    element="input"
                    type="email"
                    label="Email"
                    validators={[VALIDATOR_EMAIL()]}
                    errText="Please Enter a valid email"
                    afterInput={inputHandler}
                />
                <Input
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errText="Please enter atleast 6 characters"
                    afterInput={inputHandler}
                />
                {wannaSignUp && (
                    <ImageUpload id="image" center onInput={inputHandler} />
                )}
                <Button
                    type="submit"
                    classes="new-place__button"
                    disabled={!formState.formStateIsValid}
                >
                    {wannaSignUp ? "Sign Up" : "Login"}
                </Button>
                <p className="dont-have-account">
                    {!wannaSignUp ? "Don't have account? Wanna" : "Wanna"}
                    <button
                        type="button"
                        className="sign-up"
                        onClick={switchToSignUp}
                    >
                        {!wannaSignUp ? "Sign Up!" : "Login?"}
                    </button>
                </p>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
