import * as Router from "koa-router";
import * as send from "koa-send";
import * as fs from "fs";
import { options } from "../main";
import { db } from "../db";

interface VideoStream {
  path: string;
  fileSize: number;
  range: string;
}

interface VideoChunk {
  start: number;
  end: number;
  size: number;
}

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

function getVideoStream(path: string, videoRange: string) {
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = videoRange;
  return {
    path: path,
    fileSize: fileSize,
    range: range
  } as VideoStream;
}

function getStreamChunk(videoStream: VideoStream) {
  const chunkRange = videoStream.range.replace(/bytes=/, "").split("-");
  const start = parseInt(chunkRange[0], 10);
  const end = chunkRange[1]
    ? parseInt(chunkRange[1], 10)
    : videoStream.fileSize - 1;
  const size = end - start + 1;
  return {
    start: start,
    end: end,
    size: size
  } as VideoChunk;
}

const getVideo = async (router: Router) => {
  router.get("/video/:id*", async ctx => {
    const id = ctx.params.id as string;
    try {
      if (id) {
        const video = (await db.query("SELECT * FROM movies;")).rows.filter(
          (video: MovieRequest) => video.id === id
        )[0] as MovieRequest;
        const videoStream = getVideoStream(video.path, ctx.headers.range);

        if (videoStream.range) {
          const streamChunk = getStreamChunk(videoStream);
          const movie = fs.createReadStream(videoStream.path, {
            start: streamChunk.start,
            end: streamChunk.end
          });

          const header = {
            "Content-Range": `bytes ${streamChunk.start}-${streamChunk.end}/${
              videoStream.fileSize
            }`,
            "Accept-Ranges": "bytes",
            "Content-Length": streamChunk.size,
            "Content-Type": "video/mp4"
          };

          ctx.res.writeHead(206, header);
          ctx.body = movie.pipe(ctx.res);
        } else {
          const header = {
            "Content-Length": videoStream.fileSize,
            "Content-Type": "video/mp4"
          };

          ctx.res.writeHead(206, header);
          ctx.body = fs.createReadStream(videoStream.path).pipe(ctx.res);
        }
      } else {
        ctx.body = { success: true };
      }
    } catch (e) {
      if (!e.state) {
        console.error(JSON.stringify(e));
        ctx.throw({
          state: 500,
          error: { message: "Internal Error", code: 100 }
        });
      } else {
        console.log(e);
        ctx.throw(e);
      }
    }
  });
};

export default getVideo;
