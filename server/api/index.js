let cachedServer = null;

async function createServer() {
  const { NestFactory } = require("@nestjs/core");
  const { ExpressAdapter } = require("@nestjs/platform-express");
  const express = require("express");
  const { AppModule } = require("../dist/app.module");
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix("api");
  app.enableCors({ origin: process.env.CLIENT_ORIGIN || "*" });
  await app.init();
  return server;
}

module.exports = async (req, res) => {
  if (!cachedServer) cachedServer = await createServer();
  return cachedServer(req, res);
};
