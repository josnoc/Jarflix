import * as Koa from "koa";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as send from "koa-send";
import * as http from "http";
import * as http2 from "http2";
import * as fs from "fs";
import * as path from "path";
import errorHandling from "./middleWare/errorHandling";
import Routes from "./Routes";

interface ServeStaticFiles {
  publicFolder: string;
  fallback?: string;
}

interface sslParameters {
  certificatePath: string;
  keyPath: string;
  keyPassword?: string;
}

export interface ServerOptions {
  port?: number;
  serveStaticFiles?: ServeStaticFiles;
  serveSSL?: sslParameters;
}

export default class Server {
  private app: Koa;
  private router: Router;
  routes: Routes;
  private port: number;
  private fallBack: string;
  private publicFolder: string;
  private sslServer: http2.Http2SecureServer;
  private koaServer: http.Server;

  constructor();
  constructor(options?: ServerOptions);
  constructor(
    options?: ServerOptions,
    app?: Koa,
    router?: Router,
    routes?: Routes
  );

  constructor(
    options?: ServerOptions,
    app?: Koa,
    router?: Router,
    routes?: Routes
  ) {
    this.app = app || new Koa();
    this.router = router || new Router();
    this.routes = routes || new Routes(this.app, this.router);

    if (options) {
      this.validateOptions(options);
      this.processOptions(options);
    } else {
      this.port = 3000;
    }
  }

  private processOptions({
    port = 3000,
    serveStaticFiles,
    serveSSL
  }: ServerOptions) {
    this.Port = port;

    if (serveStaticFiles)
      this.serveStaticFolder(
        serveStaticFiles.publicFolder,
        serveStaticFiles.fallback
      );

    if (serveSSL) this.createHttp2Server(serveSSL);
  }

  private validateOptions(options: ServerOptions) {
    if (options.serveStaticFiles)
      this.validateStaticFilesServing(options.serveStaticFiles);

    if (options.serveSSL) this.validateSSLParameters(options.serveSSL);
  }

  private validateStaticFilesServing({
    publicFolder,
    fallback
  }: ServeStaticFiles) {
    if (!fs.existsSync(publicFolder)) {
      const error = `Error creating server, publicFolder does not exists: ${publicFolder}`;
      throw error;
    }

    if (
      fallback !== undefined &&
      (fallback.length === 0 ||
        !fs.existsSync(path.join(publicFolder, fallback)))
    ) {
      const error = `Error creating server, fallback file does not exist: ${path.join(
        publicFolder,
        fallback
      )}`;
      throw error;
    }
  }

  private validateSSLParameters(SSLServer: sslParameters) {
    if (
      SSLServer.certificatePath === undefined ||
      !fs.existsSync(SSLServer.certificatePath)
    ) {
      const error = `Error creating server, certificate file does not exists "${
        SSLServer.certificatePath
      }"`;

      throw error;
    }

    if (SSLServer.keyPath === undefined || !fs.existsSync(SSLServer.keyPath)) {
      const error = `Error creating server, key file does not exists "${
        SSLServer.keyPath
      }"`;

      throw error;
    }
  }

  set Port(port) {
    if (port > 0) {
      this.port = port;
    } else {
      const error = `Error creating server, port provided is invalid: ${port}`;
      throw error;
    }
  }

  get Port() {
    return this.port;
  }

  get publicFolderServed() {
    return this.publicFolder;
  }

  get fallbackFile() {
    return this.fallBack;
  }

  get App() {
    return this.app;
  }

  get KoaServer() {
    return this.koaServer;
  }

  get SslServer() {
    return this.sslServer;
  }

  get Router() {
    return this.router;
  }

  private serveStaticFolder(publicFolder: string, fallback: string) {
    this.publicFolder = publicFolder;

    this.app.use(serve(this.publicFolder));
    if (fallback) {
      this.fallBack = fallback;
    }
    console.log(`--serving static folder in ${publicFolder}`);
  }

  private createHttp2Server({
    certificatePath,
    keyPath,
    keyPassword
  }: sslParameters) {
    const options: http2.SecureServerOptions = {
      cert: fs.readFileSync(certificatePath),
      key: fs.readFileSync(keyPath),
      passphrase: keyPassword || "",
      allowHTTP1: true
    };
    console.log("--using http2/ssl");
    this.sslServer = http2.createSecureServer(options, this.app.callback());
  }

  startServer() {
    this.app.use(errorHandling());
    this.routes.serve();

    try {
      this.setRouter();
      if (this.fallBack) {
        this.catchFallBackRoutes(this.fallBack, this.publicFolder);
      }

      if (this.sslServer) {
        this.sslServer.listen(this.port);
        console.log(`Server successfully started on port ${this.port}`);
      } else {
        this.koaServer = this.app.listen(this.port);
        console.log(`Server successfully started on port ${this.port}`);
      }
    } catch (e) {
      console.error(`Error starting server:\n${e}`);
    }
  }

  private setRouter() {
    try {
      this.app.use(this.router.routes()).use(this.router.allowedMethods());
    } catch (e) {
      throw e;
    }
  }

  private catchFallBackRoutes(fileToServe: string, publicFolder: string) {
    this.app.use(async (ctx: Koa.Context) => {
      await send(ctx, `/${fileToServe}`, { root: publicFolder });
      console.log(`--falling back on ${fileToServe} `);
    });
  }

  close() {
    if (this.sslServer) {
      this.sslServer.close();
    } else if (this.koaServer) {
      this.koaServer.close();
    }
  }
}
