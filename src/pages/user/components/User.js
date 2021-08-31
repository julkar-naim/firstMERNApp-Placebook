import React, { useState, useEffect } from "react";

import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/UIElements/ErrorModal";

import UserListItem from "./UserListItem";
import { useHTTPClient } from "../../../shared/util/hooks/http-hook";
import "./User.css";

// this is a statefull component. We are going to fetch user data from the back-end database

const User = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [hasError, setHasError] = useState();
    const { isLoading, hasError, sendRequest, clearError } = useHTTPClient();
    const [userData, setUserData] = useState([]);

    useEffect(async () => {
        try {
            let data = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/user`,
                "get"
            );
            setUserData(data.users);
        } catch (err) {}
    }, []);

    // const errorHandler = () => {
    //     setHasError(null);
    // };

    // if (userData.length === 0) {
    //     return <div className="center"> No Place Found </div>;
    // } else {
    return (
        <React.Fragment>
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}
            {isLoading && <LoadingSpinner asOverlay />}
            {userData.length === 0 && (
                <div className="center"> No Place Found </div>
            )}
            <ul>
                {userData.map((user) => (
                    <UserListItem
                        key={user.id}
                        name={user.name}
                        id={user.id}
                        image={user.image}
                        bin_img={user.bin_img}
                        placeCount={user.places.length}
                    />
                ))}
            </ul>
        </React.Fragment>
    );
    // }
};

export default User;
