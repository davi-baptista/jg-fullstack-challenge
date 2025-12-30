import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1766151044343 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
        CREATE TABLE users (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        username varchar(50) NOT NULL,
        email varchar(255) NOT NULL,
        password_hash varchar(255) NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT users_pk PRIMARY KEY (id),
        CONSTRAINT users_email_unique UNIQUE (email)
        );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS users;
        `);
    }

}
