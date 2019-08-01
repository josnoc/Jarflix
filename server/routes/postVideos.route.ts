import * as Router from "koa-router";
import { db } from "../db";
import * as uuid from "uuid";

// id         | character varying(256)     |           | not null |
//  path       | character varying(1024)    |           |          |
//  name       | character varying(100)     |           | not null |
//  overview   | character varying(1000000) |           |          |
//  director   | character varying(100)     |           |          |
//  movie_cast | character varying(1024)    |           |          |
//  trailer    | character varying(1024)    |           |          |
//  genre      | character varying(1024)    |           |          |
//  stars      | smallint                   |           |          |
//  thumbnail  | character varying(1024)    |           | not null |

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

const servePostVideo = async (router: Router) => {
  router.post("/videos", async ctx => {
    const video = { id: uuid.v4(), ...ctx.request.body } as MovieRequest;
    try {
      console.log(Object.values(video));
      const success = (await db.query(
        "INSERT INTO movies VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        Object.values(video)
      )).rowCount;

      if (success) ctx.body = { success: true };
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

export default servePostVideo;
