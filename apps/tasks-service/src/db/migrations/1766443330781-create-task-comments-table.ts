import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTaskCommentsTable1766442841000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE task_comments (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        task_id uuid NOT NULL,
        author_id uuid NOT NULL,
        content text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT task_comments_pk PRIMARY KEY (id),
        CONSTRAINT task_comments_task_fk
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS task_comments;`)
  }
}
