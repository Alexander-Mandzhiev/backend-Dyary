import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'

const logger = new Logger()

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.disable('x-powered-by', 'X-Powered-By');

	app.setGlobalPrefix('api')
	app.use(cookieParser())

	const config = new DocumentBuilder()
		.setTitle('Diary')
		.setDescription('Diary - ежедневник')
		.setVersion('1.0')
		.addTag('Маршруты')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, document)

	app.enableCors({
		origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
		credentials: true,
		exposedHeaders: `set-cookie`
	})

	await app.listen(process.env.API_PORT)
	logger.log(`server starting ${process.env.API_PORT}`)
}
bootstrap()
