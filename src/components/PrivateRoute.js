/*
    Private Route
    untuk ngecek apakah sudah login atau belum
    kalau belum, akan redirect ke login
*/

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../utils/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest} render={props => (
                isLogin() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" />
                )
            )} 
        />
    )
};

export default PrivateRoute;