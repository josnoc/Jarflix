import * as React from "react";
import { Video as IVideo } from "../Services/getVideos.services";
import { RouteComponentProps } from "react-router";

interface ComponentState {
  //Add component state interface here.
  over: boolean;
}

interface ComponentProperties extends RouteComponentProps {
  //Add component properties interface here.
  video: IVideo;
}

const defaultState: ComponentState = {
  //Add default state properties here.
  over: false
};

require("./Video.component.scss");

export default class Video extends React.Component<
  ComponentProperties,
  ComponentState
> {
  state = defaultState;

  onClick = () => {
    this.props.history.push(`/video/${this.props.video.id}`);
  };

  render() {
    return (
      <div onClick={this.onClick} className={`VideoComponent`}>
        <div className={"ComponentWrapper"}>
          <img src={require(`../images/${this.props.video.thumbnail}`)} />
          <h2>{this.props.video.name}</h2>
        </div>
      </div>
    );
  }
}
