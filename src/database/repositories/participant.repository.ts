import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Participant } from '../entities/participants.entity';
import { Event } from '../entities/event.entity';

import {
  ICreateParticipantInput,
  IParticipant,
  IUpdateParticipantInput,
} from '../interfaces/participant.interface';

@Injectable()
export class ParticipantRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly repository: Repository<Participant>,
  ) {}

  findAll(): Promise<IParticipant[]> {
    return this.repository.find({
      relations: { event: true },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<IParticipant | null> {
    return this.repository.findOne({
      where: { id },
      relations: { event: true },
    });
  }

  async create(data: ICreateParticipantInput): Promise<IParticipant> {
    const participant = this.repository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      event: { id: data.eventId } as Event,
    });

    return this.repository.save(participant);
  }

  async update(
    id: string,
    data: IUpdateParticipantInput,
  ): Promise<IParticipant | null> {
    const participant = await this.repository.findOne({
      where: { id },
    });

    if (!participant) {
      return null;
    }

    if (data.name !== undefined) participant.name = data.name;
    if (data.email !== undefined) participant.email = data.email;
    if (data.phone !== undefined) participant.phone = data.phone;

    if (data.eventId !== undefined) {
      participant.event = { id: data.eventId } as Event;
    }

    return this.repository.save(participant);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
