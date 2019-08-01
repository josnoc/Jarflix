import * as Router from "koa-router";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid/v4";
import * as moment from "moment";
import * as bcrypt from "bcrypt";
import { db } from "../db";

interface LoginRequest extends Body {
  userName: string;
  password: string;
}

interface IUser {
  id: number;
  name: string;
  password: string;
  type: boolean;
  token: string;
}

export const getUser = async (userName: string, passwd: string) => {
  try {
    let matchedUser = (await db.query("SELECT * FROM users WHERE name=$1;", [
      userName
    ])).rows[0];

    if (matchedUser && !(await bcrypt.compare(passwd, matchedUser.password))) {
      return null;
    }

    return matchedUser as IUser;
  } catch (e) {
    throw e;
  }
};

export const getJWT = (user: IUser) => {
  const payload = {
    userUId: uuid(),
    userId: user.id,
    name: user.name,
    iat: Number(moment().format())
  };

  const options: jwt.SignOptions = { expiresIn: "24h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const serveLogin = async (router: Router) => {
  router.post("/login", async ctx => {
    try {
      const login = ctx.request.body as LoginRequest;
      const user = await getUser(login.userName, login.password);

      if (user) {
        user.token = getJWT(user);
        const { password, ...loggedUser } = user;

        ctx.body = loggedUser;
      } else {
        ctx.body = { error: { message: "Incorrect Login", code: 111 } };
      }
    } catch (e) {
      if (!e.state) {
        ctx.throw({
          state: 500,
          error: { message: "Internal Error", code: 100 }
        });
      } else {
        ctx.throw(e);
      }
    }
  });
};

export default serveLogin;
