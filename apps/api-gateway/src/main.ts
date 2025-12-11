import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: 'http://localhost:4200',
		credentials: true,
	});

	await app.listen(3000);
	console.log('API Gateway is running on http://localhost:3000');
}
bootstrap();
