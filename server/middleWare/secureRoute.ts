import * as Koa from "koa";
import * as jwt from "jsonwebtoken";

import User, { IUser } from "../models/user";

interface Payload {
  userUId: string;
  userId: string;
  name: string;
  iat: number;
}

export default function secureRoute() {
  return async function secureRoute(
    ctx: Koa.Context,
    next: () => Promise<any>
  ) {
    try {
      const token = ctx.get("x-auth-token");
      const payload = jwt.verify(token, process.env.JWT_SECRET) as Payload;
      const user = (await User.findById(payload.userId)) as IUser;
      // if (user.login.token !== token) {
      //   throw { forbidden: true };
      // }

      ctx.state.user = user;

      await next();
    } catch (e) {
      if (e.state && e.error) {
        throw {
          state: e.state,
          error: e.error
        };
      } else {
        if (e.name === "TokenExpiredError") {
          const token = ctx.get("x-auth-token");
          const payload = jwt.decode(token) as Payload;
          User.update({});
          console.log(payload);
        }
        console.log(e);
        throw {
          state: 401,
          error: "Unauthorized, you must login to access this service"
        };
      }
    }
  };
}
