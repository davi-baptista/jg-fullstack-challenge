import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationsTable1766620121868 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE notifications (
			id uuid NOT NULL DEFAULT uuid_generate_v4(),
			user_id uuid NOT NULL,
			type varchar(100) NOT NULL,
			payload jsonb NOT NULL,
			read_at timestamptz,
			created_at timestamptz NOT NULL DEFAULT now(),

			CONSTRAINT notifications_pk PRIMARY KEY (id)
			);
		`)

		await queryRunner.query(`
			CREATE INDEX notifications_user_id_idx
			ON notifications(user_id);
		`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DROP TABLE IF EXISTS notifications;
		`)
	}

}
