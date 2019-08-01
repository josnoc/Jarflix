import "./config/config";
import Server, { ServerOptions } from "./Server";
import getVideo from "./routes/video.route";
import serveLogin from "./routes/login.route";
import createUser from "./routes/postUsers.route";
import addMovies from "./routes/postVideos.route";
import getVideos from "./routes/getVideos.route";
import { db } from "./db";

db.connect();

export const options: ServerOptions = JSON.parse(process.env.serverOptions);
export const server = new Server(options);

server.routes.add(getVideo);
server.routes.add(serveLogin);
server.routes.add(createUser);
server.routes.add(addMovies);
server.routes.add(getVideos);

server.startServer();
