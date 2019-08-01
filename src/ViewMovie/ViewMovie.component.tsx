import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "reactstrap";

interface ComponentState {
  //Add component state interface here.
}

interface ComponentProperties extends RouteComponentProps {
  //Add component properties interface here.
}

interface UrlParams {
  id: string;
}

const defaultState: ComponentState = {
  //Add default state properties here.
};

require("./ViewMovie.component.scss");

export default class ViewMovie extends React.Component<
  ComponentProperties,
  ComponentState
> {
  state = defaultState;

  goToMain = () => {
    this.props.history.push("/main");
  };

  render() {
    return (
      <div className="Movie">
        <Button onClick={this.goToMain}>Back</Button>
        <div className="videoWrapper">
          <video
            src={`/video/${(this.props.match.params as UrlParams).id}`}
            controls
          />
        </div>
      </div>
    );
  }
}
