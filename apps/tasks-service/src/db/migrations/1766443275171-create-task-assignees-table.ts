import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTaskAssigneesTable1766442840000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE task_assignees (
        task_id uuid NOT NULL,
        user_id uuid NOT NULL,

        CONSTRAINT task_assignees_pk PRIMARY KEY (task_id, user_id),
        CONSTRAINT task_assignees_task_fk
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS task_assignees;`)
  }
}
