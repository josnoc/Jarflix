import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MainApp } from "./MainApp/MainApp.component";
import MainLogged from "./MainLogged/MainLogged.component";
import ViewMovie from "./ViewMovie/ViewMovie.component";

export interface RouterState {
  //add component state interface here.
  loggedin: boolean;
}

interface RouterProps {
  isLoggedin: boolean;
}

const defaultState: RouterState = {
  //add default state properties here.
  loggedin: false
};

export class AppRouter extends React.Component<RouterProps, RouterState> {
  state = defaultState;

  componentDidMount() {
    this.setState(() => ({ loggedin: this.props.isLoggedin }));
  }

  setParentState = (newState: RouterState) => {
    this.setState(() => newState);
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            render={props => (
              <MainApp {...props} setParentState={this.setParentState} />
            )}
            exact={true}
          />
          {this.state.loggedin ? (
            <Route
              path="/main/"
              render={props => <MainLogged {...props} />}
              exact={true}
            />
          ) : (
            <Route
              path="/main/"
              render={props => (
                <MainApp {...props} setParentState={this.setParentState} />
              )}
              exact={true}
            />
          )}
          {this.state.loggedin ? (
            <Route
              path="/video/:id"
              render={props => <ViewMovie {...props} />}
            />
          ) : (
            <Route
              path="/video/:id"
              render={props => (
                <MainApp {...props} setParentState={this.setParentState} />
              )}
            />
          )}
        </Switch>
      </BrowserRouter>
    );
  }
}
