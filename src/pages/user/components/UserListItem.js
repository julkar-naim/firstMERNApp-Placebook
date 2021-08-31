import React from "react";
import { Link } from "react-router-dom";

import Card from "../../../shared/UIElements/Card/Card";
import Avatar from "../../../shared/UIElements/Avatar/Avatar";
import "./UserListItem.css";

const UserListItem = (props) => {
    return (
        <li>
            <div className="user-list">
                <Link to={`/${props.id}/places`}>
                    <Card classes="user-list-card">
                        <Avatar
                            classes="ul-avatar"
                            // image={`${process.env.REACT_APP_BACKEND_URL_BASE}/${props.image}`}
                            image={`data:${
                                props.bin_img.contentType
                            };base64,${props.bin_img.data.toString("base64")}`}
                        />
                        <div className="ul-card-container">
                            <h1 className="ul-card-title"> {props.name} </h1>
                            <p className="ul-card-place-counter">
                                Place Count: {props.placeCount}
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>
        </li>
    );
};

export default UserListItem;
