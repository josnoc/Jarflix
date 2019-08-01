import * as Router from "koa-router";
import { db } from "../db";

interface MovieRequest {
  id: string;
  path: string;
  name: string;
  overview: string;
  director: string;
  movie_cast: string;
  trailer: string;
  genre: string;
  stars: number;
  thumbnail: string;
}

const servePostUser = async (router: Router) => {
  router.get("/videos/:id*", async ctx => {
    const id = ctx.params.id as string;
    let videos: MovieRequest[];
    let video: MovieRequest;
    try {
      if (id)
        console.log(
          await db.query("SELECT * FROM movies WHERE name = '$1';", ["Sintel"])
        );
      else videos = (await db.query("SELECT * FROM movies;")).rows;

      if (videos) ctx.body = videos;
    } catch (e) {
      switch (e.code) {
        case "23505":
          ctx.set("Content-Type", "application/json");
          ctx.throw(400, {
            state: 400,
            error: { message: "User already exists.", code: 101 }
          });
          break;
        default:
          console.error("Error Generated: ", e);
          ctx.throw({
            state: 500,
            error: { message: "Internal Server Error", code: 100 }
          });
      }
    }
  });
};

export default servePostUser;
