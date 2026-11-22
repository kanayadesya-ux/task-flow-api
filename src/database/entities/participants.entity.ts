import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';

import type { IParticipant } from '../interfaces/participant.interface';
import { Event } from './event.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'participants' })
export class Participant extends BaseEntity implements IParticipant {
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Index('IDX_participants_event_id')
  @ManyToOne(() => Event, (event) => event.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;
}
