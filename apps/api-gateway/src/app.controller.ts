import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('auth/register')
	async register(@Body() registerDto: any) {
		return this.appService.register(registerDto);
	}

	@Post('auth/login')
	async login(@Body() loginDto: any) {
		return this.appService.login(loginDto);
	}

	@Get('portfolio/transactions')
	async getTransactions(@Headers('authorization') authHeader: string) {
		await this.appService.verifyToken(authHeader);
		return this.appService.getTransactions(authHeader);
	}

	@Post('portfolio/transactions')
	async createTransaction(
		@Headers('authorization') authHeader: string,
		@Body() transactionDto: any
	) {
		await this.appService.verifyToken(authHeader);
		return this.appService.createTransaction(authHeader, transactionDto);
	}

	@Put('portfolio/transactions/:id')
	async updateTransaction(
		@Headers('authorization') authHeader: string,
		@Param('id') id: string,
		@Body() transactionDto: any
	) {
		await this.appService.verifyToken(authHeader);
		return this.appService.updateTransaction(authHeader, id, transactionDto);
	}

	@Delete('portfolio/transactions/:id')
	async deleteTransaction(
		@Headers('authorization') authHeader: string,
		@Param('id') id: string
	) {
		await this.appService.verifyToken(authHeader);
		return this.appService.deleteTransaction(authHeader, id);
	}

	@Get('portfolio/dashboard')
	async getDashboard(@Headers('authorization') authHeader: string) {
		await this.appService.verifyToken(authHeader);
		return this.appService.getDashboard(authHeader);
	}

	@Get('logs')
	async getLogs(@Headers('authorization') authHeader: string) {
		await this.appService.verifyToken(authHeader);
		return this.appService.getLogs(authHeader);
	}
}
