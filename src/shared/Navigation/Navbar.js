import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTransition, animated } from "@react-spring/web";

import Header from "./Header";
import NavLink from "./NavLink";
import SideDrawer from "../UIElements/SideDrawer/SideDrawer";
import BackDrop from "../UIElements/BackDrop/BackDrop";
import "./Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const transition = useTransition(isOpen, {
        from: {
            opacity: 0
        },
        enter: {
            opacity: 1
        },
        leave: {
            opacity: 0
        },
        delay: 100
    });

    const injectSideDrawer = () => {
        setIsOpen(true);
    };
    const closeSideDrawer = () => {
        setIsOpen(false);
    };

    return (
        <React.Fragment>
            {isOpen && <BackDrop onClick={closeSideDrawer} />}
            {transition(
                (styles, item) =>
                    item && (
                        <animated.div style={styles}>
                            <SideDrawer>
                                <nav className="side-nav">
                                    <NavLink />
                                </nav>
                            </SideDrawer>
                        </animated.div>
                    )
            )}

            <Header>
                <nav className="navbar">
                    <div className="brand">
                        <Link to="/">
                            <h1>PlaceBook</h1>
                        </Link>
                    </div>

                    <nav className="main-nav">
                        <NavLink />
                    </nav>

                    <div className="ham-icon" onClick={injectSideDrawer}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
            </Header>
        </React.Fragment>
    );
};

export default Navbar;
