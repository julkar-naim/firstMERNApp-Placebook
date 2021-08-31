import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Card from "../../../shared/UIElements/Card/Card";
import PlaceListItem from "./PlaceListItem";
import { useHTTPClient } from "../../../shared/util/hooks/http-hook";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import "./PlaceList.css";

const PlaceList = () => {
    const userId = useParams().uid;
    const [userLoadedPlace, setUserLoadedPlace] = useState([]);
    const { isLoading, hasError, sendRequest, clearError } = useHTTPClient();

    useEffect(async () => {
        try {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/place/user/${userId}`,
                "get"
            );
            setUserLoadedPlace(response.places);
        } catch (err) {}
    }, [userId]);

    const deleteHandler = (deletedId) => {
        setUserLoadedPlace((prev) => {
            const newPlaces = prev.filter((place) => place.id !== deletedId);
            return newPlaces;
        });
    };

    return (
        <React.Fragment>
            {!isLoading && userLoadedPlace.length === 0 && (
                <Card classes="noplace">
                    <h2> No place found ! </h2>
                </Card>
            )}
            {isLoading && <LoadingSpinner asOverlay />}
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}
            <ul className="place-list">
                {userLoadedPlace.map((place) => (
                    <PlaceListItem
                        key={place.id}
                        creator={place.creator}
                        id={place.id}
                        image={place.image}
                        bin_img={place.bin_img}
                        title={place.title}
                        address={place.address}
                        description={place.description}
                        location={place.coordinate}
                        onDelete={deleteHandler}
                    />
                ))}
            </ul>
        </React.Fragment>
    );
};

export default PlaceList;
