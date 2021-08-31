import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import "../NewPlace/NewPlace.css";
import useForm from "../../shared/util/hooks/form-hook";
import Input from "../../shared/UIElements/Form/Input";
import Button from "../../shared/UIElements/Button/Button";
import { useHTTPClient } from "../../shared/util/hooks/http-hook";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators/validators";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { isLoading, hasError, sendRequest, clearError } = useHTTPClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm(
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
            }
        },
        false
    );

    useEffect(async () => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`,
                "get"
            );
            setFormData(
                {
                    title: {
                        value: response.place.title,
                        isValid: true
                    },
                    description: {
                        value: response.place.description,
                        isValid: true
                    },
                    address: {
                        value: response.place.address,
                        isValid: true
                    }
                },
                true
            );
            setLoadedPlace(response);
        } catch (err) {
            console.log("from error ", err);
        }
    }, [placeId]);

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`,
                "patch",
                {
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value
                },
                auth.token
            );
            history.push(`/${auth.userId}/places`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}
            {!isLoading && loadedPlace && (
                <form className="place-form container" onSubmit={submitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errText="Title is required"
                        afterInput={inputHandler}
                        initialValue={formState.inputs.title.value}
                        valid={formState.inputs.title.isValid}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        type="text"
                        afterInput={inputHandler}
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errText="Please enter atleast 5 characters"
                        initialValue={formState.inputs.description.value}
                        valid={formState.inputs.description.isValid}
                    />
                    <Input
                        id="address"
                        element="input"
                        type="text"
                        label="Address"
                        validators={[VALIDATOR_REQUIRE()]}
                        errText="Please enter a valid address"
                        afterInput={inputHandler}
                        initialValue={formState.inputs.address.value}
                        valid={formState.inputs.address.isValid}
                    />
                    <Button
                        type="submit"
                        classes="new-place__button"
                        disabled={!formState.formStateIsValid}
                    >
                        Update
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
};

export default UpdatePlace;
