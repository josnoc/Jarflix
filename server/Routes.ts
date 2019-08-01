import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";

export default class Routes {
  private app: Koa;
  private router: Router;
  private routes: ((router: Router) => void)[];

  constructor(app: Koa, router: Router) {
    if (!app && !router) {
      const error =
        "Error in Routes, no app and or router provided: new (app: Koa, router: Router)";
      throw error;
    }
    this.app = app;
    this.router = router;
    this.routes = new Array();
  }

  add(routeFunction: (router: Router) => void) {
    this.routes.push(routeFunction);
    return this.routes;
  }

  serve() {
    this.app.use(bodyParser());
    if (this.routes.length) {
      this.routes.map(route => {
        route(this.router);
      });
    } else {
      console.warn(
        "Warning! Routes have been served, but no routes have been provided"
      );
    }
  }
}
