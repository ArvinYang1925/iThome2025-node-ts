import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToUser1759497673670 implements MigrationInterface {
    name = 'AddPhoneToUser1759497673670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying(10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
