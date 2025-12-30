import { TaskAuditLogEntity } from "@/db/entities/task-audit-log.entity"


export abstract class TaskAuditLogsRepository {
  abstract add(assignee: TaskAuditLogEntity): Promise<void>
}
