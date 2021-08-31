import React, { useState, useContext } from "react";
import { useTransition } from "@react-spring/web";

import Card from "../../../shared/UIElements/Card/Card";
import MapBox from "../../../shared/Map/Map";
import Button from "../../../shared/UIElements/Button/Button";
import Modal from "../../../shared/UIElements/Modal/Modal";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHTTPClient } from "../../../shared/util/hooks/http-hook";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import "./PlaceListItem.css";

const PlaceListItem = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [deletePlace, setDeletePlace] = useState(false);
    const auth = useContext(AuthContext);
    const { isLoading, hasError, clearError, sendRequest } = useHTTPClient();

    const injectModal = () => setShowModal(true);
    const injectDeleteModal = () => setDeletePlace(true);
    const removeModal = () => setShowModal(false);
    const removeDelete = () => setDeletePlace(false);

    const transition = useTransition(deletePlace, {
        from: { opacity: 0, y: -500 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -500 }
    });
    const transition2 = useTransition(showModal, {
        from: { opacity: 0, y: -500 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -500 }
    });

    const deletePlaceHandler = async () => {
        removeDelete();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/place/${props.id}`,
                "delete",
                null,
                auth.token
            );
            props.onDelete(props.id);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            {hasError && <ErrorModal error={hasError} onClear={clearError} />}

            {transition2(
                (styles, item) =>
                    item && (
                        <Modal
                            show={showModal}
                            onClick={removeModal}
                            style={styles}
                            header={props.address}
                            footerClass="place-item__modal-actions"
                            footer={
                                <Button onClick={removeModal}> close </Button>
                            }
                        >
                            <MapBox
                                lng={props.location.lng}
                                lat={props.location.lat}
                            />
                        </Modal>
                    )
            )}
            {transition(
                (styles, item) =>
                    item && (
                        <Modal
                            show={deletePlace}
                            onClick={removeDelete}
                            header="Delete the place ?"
                            style={styles}
                            footerClass="place-item__modal-actions"
                            classes={deletePlace && "delete-modal"}
                            footer={
                                <React.Fragment>
                                    <Button onClick={deletePlaceHandler}>
                                        Hell Yeah!
                                    </Button>
                                    <Button onClick={removeDelete}>
                                        Nah! Just kidding
                                    </Button>
                                </React.Fragment>
                            }
                        >
                            <p>
                                Are you sure you want to delete this place. This
                                action cannot be undone. You have to live with
                                it.
                            </p>
                        </Modal>
                    )
            )}

            <li className="place-item">
                <Card classes="place-item__card">
                    <img
                        className="place-item__image"
                        // src={`${process.env.REACT_APP_BACKEND_URL_BASE}/${props.image}`}
                        src={`data:${
                            props.bin_img.contentType
                        };base64,${props.bin_img.data.toString("base64")}`}
                        alt=""
                    />
                    <div className="place-item__content">
                        <h2 className="place-item__title"> {props.title}</h2>
                        <h3 className="place-item__address">{props.address}</h3>
                        <p className="place-item__description">
                            {props.description}
                        </p>
                    </div>
                    <hr className="separator__action" />
                    <div className="place-item__actions">
                        <Button onClick={injectModal}>view on map</Button>
                        {auth.isLoggedIn && auth.userId === props.creator && (
                            <Button to={`/places/${props.id}`}>edit</Button>
                        )}
                        {auth.isLoggedIn && auth.userId === props.creator && (
                            <Button danger onClick={injectDeleteModal}>
                                delete
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceListItem;
