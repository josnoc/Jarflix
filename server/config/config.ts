import { config } from "./cfg";

const env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test" || env === "debug") {
  const envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    if (typeof envConfig[key] === "string") {
      process.env[key] = envConfig[key];
    } else {
      process.env[key] = JSON.stringify(envConfig[key]);
    }
  });
}
