import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EVENT_REPOSITORY } from '../../../database/interfaces/event-repository.interface';

import type {
  IEventRepository,
  IEventPaginationQuery,
} from '../../../database/interfaces/event-repository.interface';

import { EventStatus } from '../../../database/enums/event-status.enum';

import type {
  ICreateEventInput,
  IEvent,
  IUpdateEventInput,
} from '../../../database/interfaces/event.interface';

import type { IPaginatedResult } from '../../../utils';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  findAll(
    query: IEventPaginationQuery = {},
  ): Promise<IPaginatedResult<IEvent>> {
    const normalizedQuery = { ...query };

    if (normalizedQuery.status !== undefined) {
      normalizedQuery.status = this.validateStatus(normalizedQuery.status);
    }

    return this.eventRepository.findPaginated(normalizedQuery);
  }

  async findById(id: string): Promise<IEvent> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }

  create(payload: ICreateEventInput): Promise<IEvent> {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Request body must be a JSON object');
    }

    const input: ICreateEventInput = {
      name: this.validateName(payload.name),
      description: this.validateDescription(payload.description),
      location: this.validateLocation(payload.location),
      startDate: this.parseDate(payload.startDate, 'startDate'),
      endDate: this.parseDate(payload.endDate, 'endDate'),
      status:
        payload.status !== undefined
          ? this.validateStatus(payload.status)
          : EventStatus.PLANNED,
    };

    this.validateEventDates(input.startDate, input.endDate);

    return this.eventRepository.create(input);
  }

  async update(id: string, payload: IUpdateEventInput): Promise<IEvent> {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Request body must be a JSON object');
    }

    const existingEvent = await this.findById(id);
    const input: IUpdateEventInput = {};

    if (payload.name !== undefined) {
      input.name = this.validateName(payload.name);
    }

    if (payload.description !== undefined) {
      input.description = this.validateDescription(payload.description);
    }

    if (payload.location !== undefined) {
      input.location = this.validateLocation(payload.location);
    }

    if (payload.startDate !== undefined) {
      input.startDate = this.parseDate(payload.startDate, 'startDate');
    }

    if (payload.endDate !== undefined) {
      input.endDate = this.parseDate(payload.endDate, 'endDate');
    }

    if (payload.status !== undefined) {
      input.status = this.validateStatus(payload.status);
    }

    const startDate = input.startDate ?? existingEvent.startDate;
    const endDate = input.endDate ?? existingEvent.endDate;

    this.validateEventDates(startDate, endDate);

    const updated = await this.eventRepository.update(id, input);

    if (!updated) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return updated;
  }

  async updateStatus(id: string, status: EventStatus): Promise<IEvent> {
    const validatedStatus = this.validateStatus(status);

    const updated = await this.eventRepository.updateStatus(
      id,
      validatedStatus,
    );

    if (!updated) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const deleted = await this.eventRepository.remove(id);

    if (!deleted) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return { id, deleted: true };
  }

  private validateName(name: unknown): string {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('name must be a non-empty string');
    }

    const trimmed = name.trim();

    if (trimmed.length > 150) {
      throw new BadRequestException('name must not exceed 150 characters');
    }

    return trimmed;
  }

  private validateLocation(location: unknown): string {
    if (typeof location !== 'string' || location.trim().length === 0) {
      throw new BadRequestException('location must be a non-empty string');
    }

    const trimmed = location.trim();

    if (trimmed.length > 200) {
      throw new BadRequestException('location must not exceed 200 characters');
    }

    return trimmed;
  }

  private validateDescription(description: unknown): string | null | undefined {
    if (description === undefined || description === null) {
      return description;
    }

    if (typeof description !== 'string') {
      throw new BadRequestException('description must be a string or null');
    }

    return description;
  }

  private validateStatus(status: unknown): EventStatus {
    if (
      typeof status !== 'string' ||
      !Object.values(EventStatus).includes(status as EventStatus)
    ) {
      throw new BadRequestException(
        `status must be one of: ${Object.values(EventStatus).join(', ')}`,
      );
    }

    return status as EventStatus;
  }

  private parseDate(value: unknown, field: string): Date {
    let parsed: Date;

    if (value instanceof Date) {
      parsed = value;
    } else if (typeof value === 'string' && value.trim().length > 0) {
      parsed = new Date(value);
    } else {
      throw new BadRequestException(`${field} must be a valid date`);
    }

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`${field} must be a valid date`);
    }

    return parsed;
  }

  private validateEventDates(startDate: Date, endDate: Date): void {
    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException(
        'endDate must not be earlier than startDate',
      );
    }
  }
}
