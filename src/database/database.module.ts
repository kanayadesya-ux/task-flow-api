import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

import { Task } from './entities/task.entity';
import { Event } from './entities/event.entity';
import { Participant } from './entities/participants.entity';

import { TASK_REPOSITORY } from './interfaces/task-repository.interface';
import { EVENT_REPOSITORY } from './interfaces/event-repository.interface';

import { TaskRepository } from './repositories/task.repository';
import { EventRepository } from './repositories/event.repository';
import { ParticipantRepository } from './repositories/participant.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Task, Event, Participant]),
  ],
  providers: [
    TaskRepository,
    EventRepository,
    ParticipantRepository,
    {
      provide: TASK_REPOSITORY,
      useExisting: TaskRepository,
    },
    {
      provide: EVENT_REPOSITORY,
      useExisting: EventRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    TaskRepository,
    ParticipantRepository,
    EVENT_REPOSITORY,
    TASK_REPOSITORY,
  ],
})
export class DatabaseModule {}
