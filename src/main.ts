import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // DICA: Para tirar a prova real, você pode trocar a linha abaixo por "origin: true,"
    // temporariamente. Se funcionar com true, você sabe que o erro era a variável de ambiente.
    origin: true,

    // Adicionado OPTIONS e PATCH (PATCH é muito comum em APIs REST)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // Adicionado o "0.0.0.0" para garantir que a porta ouça requisições externas na Hostinger
  await app.listen(process.env.PORT ?? 8080, "0.0.0.0");
}

bootstrap().catch((err) => {
  console.error("Error during bootstrap:", err);
});
