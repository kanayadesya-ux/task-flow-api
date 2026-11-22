import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsAndParticipantsTable1795233000000 implements MigrationInterface {
  name = 'CreateEventsAndParticipantsTable1795233000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`events\` (
        \`id\` varchar(36) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`name\` varchar(150) NOT NULL,
        \`description\` text NULL,
        \`location\` varchar(200) NOT NULL,
        \`start_date\` datetime NOT NULL,
        \`end_date\` datetime NOT NULL,
        \`status\` enum ('PLANNED', 'ONGOING', 'COMPLETED') NOT NULL DEFAULT 'PLANNED',
        INDEX \`IDX_events_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`participants\` (
        \`id\` varchar(36) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`name\` varchar(150) NOT NULL,
        \`email\` varchar(150) NOT NULL,
        \`phone\` varchar(20) NOT NULL,
        \`event_id\` varchar(36) NOT NULL,
        INDEX \`IDX_participants_event_id\` (\`event_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_participants_event_id\`
        FOREIGN KEY (\`event_id\`) REFERENCES \`events\` (\`id\`)
        ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \`participants\`
    `);

    await queryRunner.query(`
      DROP TABLE \`events\`
    `);
  }
}
