import React from "react";
import ReactDOM from "react-dom";
import { animated } from "@react-spring/web";

import BackDrop from "../BackDrop/BackDrop";
import "./Modal.css";

const ModalOverlay = (props) => {
    const content = (
        <animated.div className={`modal ${props.classes}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>

            <form
                className="modal-form"
                onSubmit={
                    props.onSubmit
                        ? props.onSubmit
                        : (event) => event.preventDefault()
                }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>

                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </animated.div>
    );
    return ReactDOM.createPortal(
        content,
        document.getElementById("modal-hook")
    );
};

const Modal = (props) => {
    return (
        <React.Fragment>
            {props.show && <BackDrop onClick={props.onClick} />}
            {props.show && <ModalOverlay {...props} />}
        </React.Fragment>
    );
};

export default Modal;
