import React from "react";

import "./SideDrawer.css";

const SideDrawer = (props) => {
    const content = <aside className="side-drawer"> {props.children} </aside>;

    return content;

    // return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
