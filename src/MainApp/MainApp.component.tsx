import * as React from "react";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import { Button } from "react-bootstrap";
import login, { Login } from "../Services/login.service";
import { RouteComponentProps } from "react-router";
import { RouterState } from "app/AppRouter";

require("./MainApp.component.scss");

interface State {
  user: string;
  password: string;
  error: boolean;
}

interface onChangeEvent {
  target: HTMLInputElement;
}

interface selfProps extends RouteComponentProps<any, any> {
  setParentState: (state: RouterState) => void;
}

export class MainApp extends React.Component<selfProps, {}> {
  state = {} as State;

  onEmailChange = (event: onChangeEvent) => {
    const email = event.target.value;

    if (email) {
      this.setState(
        () =>
          ({
            user: email
          } as State)
      );
    }
  };

  onPasswordChange = (event: onChangeEvent) => {
    const password = event.target.value;

    if (password) {
      this.setState(
        () =>
          ({
            password: password
          } as State)
      );
    }
  };

  onLogin = async () => {
    try {
      const response = (await login(
        this.state.user,
        this.state.password
      )) as Login;
      localStorage.setItem("x-auth", response.token);
      this.props.setParentState({ loggedin: true });
      this.props.history.push("/main");
    } catch (e) {
      this.setState(() => ({
        error: true
      }));
      alert(e);
    }
  };

  render() {
    return (
      <div className="Login">
        <div className={`loginForm${this.state.error ? " error" : ""}`}>
          <Form>
            <h1>Jarflix</h1>
            <FormGroup>
              <Input
                type="email"
                id="email"
                placeholder="User Name"
                name="email"
                onChange={this.onEmailChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                onChange={this.onPasswordChange}
              />
            </FormGroup>
            {this.state.error && (
              <FormGroup>
                <Alert color="danger" variant="danger">
                  <strong>Error:</strong> Usuario o Contraseña incorrecta
                </Alert>
              </FormGroup>
            )}
            <Button onClick={this.onLogin}>Login</Button>
          </Form>
        </div>
      </div>
    );
  }
}
