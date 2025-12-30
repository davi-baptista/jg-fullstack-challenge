import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTasksTable1766442837459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tasks (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        title varchar(255) NOT NULL,
        description text,
        due_date timestamptz,
        priority varchar(20) NOT NULL,
        status varchar(20) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT tasks_pk PRIMARY KEY (id)
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tasks;`)
  }
}
