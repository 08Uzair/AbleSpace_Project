import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({ origin: process.env.CLIENT_ORIGIN || "*" });
  const port = Number(process.env.PORT) || 5000;
  await app.listen(port);
  console.log(`AbleSpace API running on http://localhost:${port}`);
}

void bootstrap();
