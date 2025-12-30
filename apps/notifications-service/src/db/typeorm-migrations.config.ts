import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv'
import type { DataSourceOptions} from 'typeorm';
import { DataSource } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: configService.get('DB_HOST'),
	port: configService.get('DB_PORT'),
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_NAME'),
	entities: [NotificationEntity],
	migrations: [__dirname + '/migrations/*.ts'],
	synchronize: false
}

export default new DataSource(dataSourceOptions)