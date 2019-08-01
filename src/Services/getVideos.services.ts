import axios from "axios";

export interface Video {
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

export interface Error {
  message: string;
  code: string;
}

export default async function login() {
  try {
    const videos = (await axios.get("/videos")).data as Video[];
    console.log(videos);
    return videos;
  } catch (e) {
    throw e as Error;
  }
}
