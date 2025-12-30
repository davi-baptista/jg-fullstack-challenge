import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTaskAuditLogsTable1766442842000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE task_audit_logs (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        task_id uuid NOT NULL,
        action varchar(50) NOT NULL,
        performed_by uuid,
        created_at timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT task_audit_logs_pk PRIMARY KEY (id),
        CONSTRAINT task_audit_logs_task_fk
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS task_audit_logs;`)
  }
}
