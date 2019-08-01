import * as Router from "koa-router";
import * as bcrypt from "bcrypt";
import { db } from "../db";

interface UserRequest {
  name: string;
  password: string;
  type: boolean;
}

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 8);
};

const servePostUser = async (router: Router) => {
  router.post("/users", async ctx => {
    const userRequest = {
      ...(ctx.request.body as UserRequest),
      password: await hashPassword((ctx.request.body as UserRequest).password)
    };
    try {
      const success = (await db.query(
        `INSERT INTO users VALUES(DEFAULT,$1, $2, $3);`,
        [userRequest.name, userRequest.password, userRequest.type]
      )).rowCount;

      if (success) {
        ctx.body = { success: true };
      }
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
