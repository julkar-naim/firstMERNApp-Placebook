import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import useForm from "../../shared/util/hooks/form-hook";

import Input from "../../shared/UIElements/Form/Input";
import Button from "../../shared/UIElements/Button/Button";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators/validators";
import "./NewPlace.css";
import { useHTTPClient } from "../../shared/util/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import ImageUpload from "../../shared/UIElements/Form/ImageUpload";

const NewPlace = () => {
    const history = useHistory();
    const { isLoading, hasError, sendRequest, clearError } = useHTTPClient();
    const auth = useContext(AuthContext);
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false
            },
            description: {
                value: "",
                isValid: false
            },
            address: {
                value: "",
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        true
    );

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            formData.append("creator", auth.userId);
            formData.append("image", formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/place",
                "post",
                formData,
                auth.token
            );
            history.push(`/${auth.userId}/places`);
        } catch (err) {
            console.log("getting error from here", err);
        }
    };

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}
            <form className="place-form container" onSubmit={submitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errText="Name is required"
                    afterInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errText="Please enter atleast 5 characters"
                    afterInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errText="Please enter a valid address"
                    afterInput={inputHandler}
                />
                <ImageUpload id="image" onInput={inputHandler} />
                <Button
                    type="submit"
                    classes="new-place__button"
                    disabled={!formState.formStateIsValid}
                >
                    Add Place
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
