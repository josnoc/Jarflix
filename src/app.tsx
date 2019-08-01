import "bootstrap/dist/css/bootstrap.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppRouter } from "./AppRouter";

const isLoggedin = !!localStorage.getItem("x-auth");

console.log(isLoggedin);

const App = <AppRouter isLoggedin={isLoggedin} />;
ReactDOM.render(App, document.getElementById("App"));
