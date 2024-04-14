import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

const keyPath = path.resolve(__dirname, '../..', 'ssl', 'server.key');
const certPath = path.resolve(__dirname, '../..', 'ssl', 'server.cert');

let httpsOptions;
if (process.env.NODE_ENV === 'production') {
  // Load SSL certificates provided by Azure
  // httpsOptions = {
  //   key: fs.readFileSync('/path/to/azure/key'),
  //   cert: fs.readFileSync('/path/to/azure/cert'),
  // };
} else {
  // Load local SSL certificates for development
  const keyPath = path.resolve(__dirname, '../..', 'ssl', 'server.key');
  const certPath = path.resolve(__dirname, '../..', 'ssl', 'server.cert');
  httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, httpsOptions);
  const configService = app.get(ConfigService);

  // Prefix for endpoonts
  app.setGlobalPrefix('rest');

  // Open API
  const config = new DocumentBuilder()
    .setTitle('SFL docs')
    .setDescription('The SFL API docs')
    .setVersion('1.0')
    // TODO: enable when it will be ready for http / https
    // .setSchemes('https')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('rest', app, document);

  // Cookies
  app.use(cookieParser());

  const [CLIENT_HOSTNAME, CLIENT_PORT, SERVER_HOSTNAME, SERVER_PORT] = [
    configService.getOrThrow('CLIENT_HOSTNAME'),
    configService.getOrThrow('CLIENT_PORT'),
    configService.getOrThrow('SERVER_HOSTNAME'),
    configService.getOrThrow('SERVER_PORT'),
  ];

  // Cors
  if (configService.get('STAGE') === 'dev') {
    app.enableCors({
      origin: [
        // dev
        `https://localhost:${CLIENT_PORT}`,
        `https://${SERVER_HOSTNAME}:${SERVER_PORT}`,
        `https://${CLIENT_HOSTNAME}:${CLIENT_PORT}`,
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    const port = process.env.PORT || 3000;
    await app.listen(port, () => {
      console.log(`Server is run at http://localhost:${port}`);
    });
  } else {
    await app.listen(SERVER_PORT, SERVER_HOSTNAME, () => {
      console.log(
        `Server works on https://${SERVER_HOSTNAME}:${SERVER_PORT} [in ${process.env.NODE_ENV} mode]`,
      );
    });
  }
}
bootstrap();
