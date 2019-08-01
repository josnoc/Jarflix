import * as React from "react";
import { Input } from "reactstrap";
import getVideos, {
  Video as IVideo,
  Error
} from "../Services/getVideos.services";
import Video from "../Video/Video.component";
import { RouteComponentProps } from "react-router";

interface onChangeEvent {
  target: HTMLInputElement;
}

interface ComponentState {
  //add component state interface here.
  videos: JSX.Element[];
  error: Error;
}

interface ComponentProperties extends RouteComponentProps {
  //Add component properties interface here.
}

const defaultState: ComponentState = {
  //add default state properties here.
  videos: [] as JSX.Element[],
  error: undefined
};

require("./MainLogged.component.scss");

export default class MainLogged extends React.Component<
  ComponentProperties,
  ComponentState
> {
  state = defaultState;
  videos = [] as IVideo[];

  async componentDidMount() {
    this.getVideosFromServer();
  }

  getVideosFromServer = async () => {
    try {
      this.videos = await getVideos();
      this.setState(() => {
        return {
          videos: this.videos.map(serverVideo => (
            <Video {...this.props} key={serverVideo.id} video={serverVideo} />
          ))
        };
      });
    } catch (e) {
      this.setState(() => ({ error: e }));
    }
  };

  onSearch = (event: onChangeEvent) => {
    const keywords = event.target.value.split(" ");
    this.setState(() => {
      const videos = this.videos.filter(video => {
        if (
          keywords
            .map(keyword => {
              return video.name.toUpperCase().includes(keyword.toUpperCase());
            })
            .includes(true)
        ) {
          return true;
        } else {
          return false;
        }
      });
      return {
        videos: videos.map(serverVideo => (
          <Video {...this.props} key={serverVideo.id} video={serverVideo} />
        ))
      };
    });
  };

  render() {
    return (
      <div className="main">
        <header className="Header">
          <h1>Jarflix</h1>
          <Input onChange={this.onSearch} type="text" placeholder="search..." />
        </header>
        <main>{this.state.videos}</main>
      </div>
    );
  }
}
