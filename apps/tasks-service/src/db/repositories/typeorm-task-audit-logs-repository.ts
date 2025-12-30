import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TaskAuditLogEntity } from '@/db/entities/task-audit-log.entity'
import { TaskAuditLogsRepository } from '@/repositories/task-audit-logs-repository'

@Injectable()
export class TypeOrmTaskAuditLogsRepository implements TaskAuditLogsRepository {
  constructor(
    @InjectRepository(TaskAuditLogEntity)
    private readonly repository: Repository<TaskAuditLogEntity>,
  ) {}

  async add(auditLog: TaskAuditLogEntity) {
    await this.repository.save(auditLog)
  }
}
