import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv'
import type { DataSourceOptions} from 'typeorm';
import { DataSource } from 'typeorm';
import { TaskAssigneeEntity } from './entities/task-assignee.entity';
import { TaskCommentEntity } from './entities/task-comment.entity';
import { TaskAuditLogEntity } from './entities/task-audit-log.entity';
import { TaskEntity } from './entities/task.entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: configService.get('DB_HOST'),
	port: configService.get('DB_PORT'),
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_NAME'),
	entities: [TaskEntity ,TaskAssigneeEntity, TaskCommentEntity, TaskAuditLogEntity],
	migrations: [__dirname + '/migrations/*.ts'],
	synchronize: false
}

export default new DataSource(dataSourceOptions)