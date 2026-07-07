import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Prefixo Global: Faz todas as rotas começarem com /api
  // Isso resolve o conflito com a sua variável VITE_API_URL do frontend
  // app.setGlobalPrefix("api");

  // 2. Configuração de CORS corrigida (com OPTIONS e PATCH)
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ].filter((url): url is string => !!url),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  });

  // 3. Validações e Interceptors mantidos perfeitamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Porta Dinâmica e Liberação de IP Externo (Crucial para a Hostinger)
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
}

bootstrap().catch((err) => {
  console.error("Error during bootstrap:", err);
});
