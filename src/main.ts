import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { json, urlencoded } from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumentar o limite de payload para permitir importação em massa (ex: textos gigantes)
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  // 1. Prefixo Global: Faz todas as rotas começarem com /api
  // Isso resolve o conflito com a sua variável VITE_API_URL do frontend
  // app.setGlobalPrefix("api");

  // 2. Configuração de CORS corrigida (com OPTIONS e PATCH)
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.ADMIN_FRONTEND_URL,
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

  // 4. Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("ConcursoPro API")
    .setDescription("Documentação interativa de todos os endpoints do backend")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // 5. Porta Dinâmica e Liberação de IP Externo (Crucial para a Hostinger)
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // 6. Roda as migrations APÓS o app já estar ouvindo a porta!
  // Isso impede que a Hostinger dê timeout de 3 segundos matando o app.
  try {
    const { DataSource } = await import("typeorm");
    const dataSource = app.get(DataSource);
    await dataSource.runMigrations();
    console.log("Migrations executadas com sucesso após o boot!");
  } catch (err) {
    console.error("Erro ao rodar migrations:", err);
  }
}

bootstrap().catch((err) => {
  console.error("Error during bootstrap:", err);
});
