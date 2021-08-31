import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// import NewPlace from "./pages/NewPlace/NewPlace";
import User from "./pages/user/components/User";
import Navbar from "./shared/Navigation/Navbar";
// import PlaceList from "./pages/places/components/PlaceList";
// import UpdatePlace from "./pages/UpdatePlace/UpdatePlace";
// import Authentication from "./pages/Authentication/Authentication";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/UIElements/LoadingSpinner";
import "./App.css";

const NewPlace = React.lazy(() => import("./pages/NewPlace/NewPlace"));
// const User = React.lazy(() => import("./pages/user/components/user"));
const PlaceList = React.lazy(() =>
    import("./pages/places/components/PlaceList")
);
const UpdatePlace = React.lazy(() => import("./pages/UpdatePlace/UpdatePlace"));
const Authentication = React.lazy(() =>
    import("./pages/Authentication/Authentication")
);

let logoutTimer;

const App = () => {
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const ExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(ExpirationDate);

        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token,
                expiration: ExpirationDate.toISOString()
            })
        );
    }, []);
    const logout = useCallback(() => {
        localStorage.removeItem("userData");
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
    }, []);

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem("userData"));
        if (
            localData &&
            localData.token &&
            new Date(localData.expiration) > new Date()
        ) {
            login(
                localData.userId,
                localData.token,
                new Date(localData.expiration)
            );
        }
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpirationDate]);

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <div className="container">
                        <User />
                    </div>
                </Route>
                <Route path="/:uid/places" exact>
                    <PlaceList />
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId" exact>
                    <UpdatePlace />
                </Route>
                <Route path="/notfound">
                    <div> something just broke dude ! fix it </div>
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <div className="container">
                        <User />
                    </div>
                </Route>
                <Route path="/:uid/places" exact>
                    <PlaceList />
                </Route>
                <Route path="/auth" exact>
                    <Authentication />
                </Route>
                <Route path="/notfound">
                    <div> something just broke dude ! fix it </div>
                </Route>
                <Redirect to="/notfound" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                login: login,
                logout: logout,
                userId: userId
            }}
        >
            <Router>
                <Navbar />
                <main>
                    <Suspense
                        fallback={
                            <div className="center">
                                <LoadingSpinner asOverlay />
                            </div>
                        }
                    >
                        {routes}
                    </Suspense>
                </main>
            </Router>
        </AuthContext.Provider>
    );
};
export default App;
