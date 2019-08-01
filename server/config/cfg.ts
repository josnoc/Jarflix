import { ServerOptions } from "../Server";
import * as path from "path";

interface Environment {
  MONGODB_URI: string;
  JWT_SECRET: string;
  serverOptions: ServerOptions;
  [key: string]: any;
}

export interface Config {
  test: Environment;
  debug: Environment;
  development: Environment;
}

export const config: Config = {
  test: {
    MONGODB_URI: "mongodb://localhost:27017/InHotelWebTest",
    JWT_SECRET:
      "OPDH9P8yshukjGsmJOIWHLtw0IXBJHydpoNKJSGP8oujclkGIUEUhdjhYIKDBkgdoHdhIDJNMNhc9pJDJUYposnjHDP9EJlkch0899USJLKg978d",
    serverOptions: {
      port: 3000,
      serveStaticFiles: {
        publicFolder: path.join(__dirname, "..", "..", "public"),
        fallback: "index.html"
      },
      serveSSL: {
        certificatePath: path.join(__dirname, "..", "..", "/server.crt"),
        keyPath: path.join(__dirname, "..", "..", "key.pem"),
        keyPassword: ""
      }
    }
  },
  debug: {
    MONGODB_URI: "mongodb://localhost:27017/InHotelWeb",
    JWT_SECRET:
      "q0op3rhflkxjcUQ30R9U0auwf087Q9EWF308a3afuOIAgu3piyaw30uFPIAWYU9G30euvo3y09fuPIAYEF08ueqfoiYUQ30EFhefyHEIOy3HO3Iy",
    serverOptions: {
      port: 3000,
      serveStaticFiles: {
        publicFolder: path.join(__dirname, "..", "..", "..", "public"),
        fallback: "index.html"
      },
      serveSSL: {
        certificatePath: path.join(__dirname, "..", "..", "..", "/server.crt"),
        keyPath: path.join(__dirname, "..", "..", "..", "key.pem"),
        keyPassword: ""
      }
    }
  },
  development: {
    MONGODB_URI: "mongodb://localhost:27017/InHotelWeb",
    JWT_SECRET:
      "q0op3rhflkxjcUQ30R9U0auwf087Q9EWF308a3afuOIAgu3piyaw30uFPIAWYU9G30euvo3y09fuPIAYEF08ueqfoiYUQ30EFhefyHEIOy3HO3Iy",
    serverOptions: {
      port: 3000,
      serveStaticFiles: {
        publicFolder: path.join(__dirname, "..", "..", "public"),
        fallback: "index.html"
      },
      serveSSL: {
        certificatePath: path.join(__dirname, "..", "..", "/server.crt"),
        keyPath: path.join(__dirname, "..", "..", "key.pem"),
        keyPassword: ""
      }
    }
  }
};
