import * as Koa from "koa";

// export interface IError {
//   status: string;
//   error: {
//     code: string;
//     message: string;
//     [x: string]: any;
//   };
// }

export default function errorHandling() {
  return async function errorHandling(
    ctx: Koa.Context,
    next: () => Promise<any>
  ) {
    try {
      await next();
    } catch (e) {
      console.log(e, e.error, e.body);
      ctx.status = e.state ? e.state : e.status;
      ctx.body = e.error ? e.error : e.body;
      console.error("Error Generated:", JSON.stringify(e.error));
    }
  };
}
