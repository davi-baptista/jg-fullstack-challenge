import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvModule } from "src/env/env.module";
import { EnvService } from "src/env/env.service";

@Module({
		imports: [TypeOrmModule.forRootAsync({
			imports: [EnvModule],
			useFactory: async (envService: EnvService) => ({
				type: 'postgres',
				host: envService.get('DB_HOST'),
				port: envService.get('DB_PORT'),
				username: envService.get('DB_USER'),
				password: envService.get('DB_PASSWORD'),
				database: envService.get('DB_NAME'),
				entities: [__dirname + '/entities/**'],
				migrations: [__dirname + '/migrations/*.ts'],
				synchronize: true
			}),
			inject: [EnvService]
		})]
})
export class DbModule { }