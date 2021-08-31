import React, { useContext } from "react";
import { NavLink as Link } from "react-router-dom";

import { AuthContext } from "./../context/auth-context";
import Button from "../../shared/UIElements/Button/Button";
import "./NavLink.css";

const NavLink = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-link">
            <li>
                <Link to="/" activeClassName="active" exact>
                    All Users
                </Link>
            </li>
            {auth.isLoggedIn && (
                <li>
                    <Link
                        to={`/${auth.userId}/places`}
                        activeClassName="active"
                        exact
                    >
                        My Places
                    </Link>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <Link to="/places/new" activeClassName="active" exact>
                        Add Places
                    </Link>
                </li>
            )}
            {!auth.isLoggedIn && (
                <li>
                    <Link to="/auth" activeClassName="active" exact>
                        Authenticate
                    </Link>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <Button classes="logout-button" onClick={auth.logout}>
                        Logout
                    </Button>
                </li>
            )}
        </ul>
    );
};

export default NavLink;
