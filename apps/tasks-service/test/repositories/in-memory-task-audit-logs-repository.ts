import { TaskAuditLogEntity } from "@/db/entities/task-audit-log.entity";
import { TaskAuditLogsRepository } from "@/repositories/task-audit-logs-repository";

export class InMemoryTaskAuditLogsRepository implements TaskAuditLogsRepository {
  public items: TaskAuditLogEntity[] = []
  
  async add(comment: TaskAuditLogEntity) {
    this.items.push(comment)
  }
}