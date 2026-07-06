import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Fallback to Vite default port just in case
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error("Error during bootstrap:", err);
});
